package ma.morwork.controller;


import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import jakarta.persistence.EntityNotFoundException;
import ma.morwork.dto.*;
import ma.morwork.modele.User;
import ma.morwork.modele.*;
import ma.morwork.repository.CommentRepository;
import ma.morwork.repository.PostLikeRepository;
import ma.morwork.repository.ReplyRepository;
import ma.morwork.repository.RepostRepository;
import ma.morwork.service.NotificationService;
import ma.morwork.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ma.morwork.service.PostService;

@RestController
@RequestMapping("/morwork/api/v1/post")
@CrossOrigin(origins = "*")
public class PostController {
	
	@Autowired
	private PostService postService;
	@Autowired
	private UserService userService;
	@Autowired
	private NotificationService notificationService;


	private static final String MyDirectory = "src/main/resources/static/media";
	@PostMapping("/newPost")
	public String newPost(@RequestParam(name = "image" , required = false) MultipartFile image, @RequestParam("content") String content
    ,@RequestParam("author") Long user_id) {
		try {
			if(!Files.exists(Paths.get(MyDirectory))) {
				Files.createDirectories(Paths.get(MyDirectory));
			}
			StandartPost post = new StandartPost();
			if(image != null) {
				String imageName = image.getOriginalFilename();
		        Path imagePath = Paths.get(MyDirectory, imageName);
		        
		        Files.write(imagePath, image.getBytes());
	
		        String imageUrl = MyDirectory + "/" + imageName;
		        post.setImage(imageName);
			}
	        if(content != null) {
	        	post.setContent(content);
	        }
			post.setType(PostType.STANDART_POST);
	        
	        if(content != "" || image !=null) {
                User user = userService.getUserById(user_id);
				post.setAuthor(user);
	        	postService.savePost(post);
	        }
		}catch(Exception e) {
			e.printStackTrace();
		}
		return "user Added";
	}

	@PostMapping("/{postId}/like")
	public ResponseEntity<String> likePost(@PathVariable Long postId,
										   @RequestParam("userId") Long userId,
										   @RequestParam("postType") String postType) {

		boolean notLiked =  postService.likePost(postId,userId,postType);
		if (notLiked && postType.equals("STANDART_POST")) {
			if(userId != postService.getPostById(postId).get().getAuthor().getId()){
				notificationService.sendNotification(userId,postId,postType,Action.LIKE);
			}
		} else if (notLiked && postType.equals("REPOSTED")) {
			if(userId != postService.getRepostById(postId).get().getAuthor().getId()){
				notificationService.sendNotification(userId,postId,postType,Action.LIKE);
			}
		}
		return ResponseEntity.ok("Post Liked");
	}




	@GetMapping("/likes/{id}")
	public List<PostLikeDTO> getLikes(@PathVariable("id") Long id){
		return postService.getAllPostLikesByPostId(id);
	}


	@GetMapping("/{postId}/{postType}")
	public PostDTO getPostById(@PathVariable("postId") Long postId, @PathVariable String postType){
		return  postService.getPost(postId, postType);
	}

	@PostMapping("/newComment")
	public ResponseEntity<String> newComment(@RequestParam("postId") Long postId, @RequestParam("userId") Long userId
			, @RequestParam("content") String content
			,@RequestParam("postType") String postType){

		if(content.isEmpty()){
			return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body("Null comment");
		}
		try {
			postService.addComment(postId, userId, content, postType);

			if (postType.equals("STANDART_POST")) {
				if(userId != postService.getPostById(postId).get().getAuthor().getId()){
					notificationService.sendNotification(userId,postId,postType,Action.COMMENT);
				}
			} else if (postType.equals("REPOSTED")) {
				if(userId != postService.getRepostById(postId).get().getAuthor().getId()){
					notificationService.sendNotification(userId,postId,postType,Action.COMMENT);
				}
			}

			return ResponseEntity.ok("Comment added successfully");
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to add comment");
		}
	}
	@Autowired
	private CommentRepository commentRepository;
	@PostMapping("/likeComment/{commentId}")
	public ResponseEntity<String> likeComment(@PathVariable("commentId") Long  commentId, @RequestParam("userId") Long userId){

		try{
			postService.likeComment(commentId,userId);
			if(userId != commentRepository.findById(commentId).get().getUser().getId()){
				notificationService.sendNotification(userId,commentId,"COMMENT",Action.LIKE);
			}

			return  ResponseEntity.ok("Comment liked successfully");
		}catch (Exception e){
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("failed to like comment");
		}
	}
	//	@GetMapping("/commentLikes/{id}")
//	public List<CommentLikeDTO> getAllCommentLikes(@PathVariable("id") Long id){
//		return postService.getAllCommentLikesByCommentId(id);
//	}
	@GetMapping("/{postId}/commentLikes")
	public List<CommentLikeDTO> getAllCommentLikesByPostId(@PathVariable Long postId) {
		return postService.getAllCommentLikesByPostId(postId);
	}

	@GetMapping
	public List<PostDTO> feed() {

		return postService.getAllPostsSortedByDate();
	}

	@PostMapping("/newReply")
	public ResponseEntity<String> addReply(@RequestParam Long userId, @RequestParam Long commentId, @RequestParam String content) {
		try {
			if (userId == null || commentId == null || content == null) {
				return ResponseEntity.badRequest().body("Invalid input parameters");
			}

			postService.addReply(commentId, userId, content);
			if(userId != commentRepository.findById(commentId).get().getUser().getId()){
				notificationService.sendNotification(userId,commentId,"COMMENT",Action.REPLY);
			}

			return ResponseEntity.ok("Reply added successfully");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to add reply: " + e.getMessage());
		}
	}


	@Autowired
	private ReplyRepository replyRepository;
	@PostMapping("/likeReply")
	public ResponseEntity<String> likeReply(@RequestParam Long replyId, @RequestParam Long userId) {
		try {
			if (replyId == null || userId == null) {
				return ResponseEntity.badRequest().body("Invalid input parameters");
			}

			postService.likeReply(replyId, userId);
			if(userId != replyRepository.findById(replyId).get().getUser().getId()){
				notificationService.sendNotification(userId,replyId,"REPLY",Action.LIKE);
			}

			return ResponseEntity.ok("Reply liked successfully");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to like reply: " + e.getMessage());
		}
	}
	@DeleteMapping("/{commentId}/comment")
	public ResponseEntity<String> deleteComment(@PathVariable Long commentId) {
		try {

			postService.deleteEntityById(commentId, Comment.class);
			return ResponseEntity.ok("Comment deleted successfully");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete comment");
		}
	}
	@DeleteMapping("/{postId}/Post/{postType}")
	public ResponseEntity<String> deletePost(@PathVariable Long postId, @PathVariable String postType) {
		try {
			if(postType.equals("STANDART_POST")){
				postService.deleteEntityById(postId, StandartPost.class);
			}else{
				postService.deleteEntityById(postId, Repost.class);
			}
			return ResponseEntity.ok("Post deleted successfully");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete Post");
		}
	}
	@DeleteMapping("/{replyId}/reply")
	public ResponseEntity<String> deleteReply(@PathVariable Long replyId) {
		try {

			postService.deleteEntityById(replyId, Reply.class);
			return ResponseEntity.ok("Reply deleted successfully");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete Reply");
		}
	}
    @PutMapping("/{commentId}/comment")
    public ResponseEntity<String> updateComment(@PathVariable Long commentId, @RequestParam String updatedContent) {
        try {

            MultipartFile file = null;
            postService.updateEntityById(commentId, updatedContent,file, Comment.class);
            return ResponseEntity.ok("Comment updated successfully");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update comment");
        }
    }

    @PutMapping("/{replyId}/reply")
    public ResponseEntity<String> updateReply(@PathVariable Long replyId, @RequestParam String updatedContent) {
        try {
            MultipartFile file = null;
            postService.updateEntityById(replyId, updatedContent,file, Reply.class);
            return ResponseEntity.ok("Reply updated successfully");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update reply");
        }
    }

    @PutMapping("/{postId}")
    public ResponseEntity<String> updatePost(
            @PathVariable Long postId,
            @RequestParam(name = "image", required = false) MultipartFile image,
            @RequestParam String content
    ) {
        try {

            postService.updateEntityById(postId, content, image, StandartPost.class);
            return ResponseEntity.ok("Post updated successfully");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update post");
        }
    }
	@PostMapping("/savePost")
	public ResponseEntity<String> savePost(@RequestParam Long userId, @RequestParam Long postId, @RequestParam String postType){
		postService.savePost(userId, postId, postType);
		return ResponseEntity.ok("Post saved successfully");
	}
	@PostMapping("/repost")
	public ResponseEntity<String> repost(@RequestParam Long userId, @RequestParam Long postId){
		postService.repost(postId,userId);
		if(userId != postService.getPostById(postId).get().getAuthor().getId()){
			notificationService.sendNotification(userId,postId,"STANDART_POST", Action.SHARE);
		}

		return ResponseEntity.ok("The Post with ID: "+postId+" has been reposted successfully");
	}

	@PostMapping("/post-job-offer")
	public ResponseEntity<?> postJobOffer(@RequestParam("id") Long id,
												@RequestBody JobPostDTO jobPostDTO) {
		try {
			postService.postJobOffer(id, jobPostDTO);
			return ResponseEntity.ok("Job offer has been posted successfully");
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("An error occurred in the service");
		}
	}
	@GetMapping("/get-company-offers")
	public ResponseEntity<?> getCompanyoffers(@RequestParam("id") Long id) {
		try {
			return ResponseEntity.ok(postService.getCompanyOffers(id));
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("An error occurred in the service");
		}
	}

	@GetMapping("/get-all-offers")
	public ResponseEntity<?> getAllOffers() {
		try {
			return ResponseEntity.ok(postService.getAllOffers());
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("An error occurred in the service");
		}
	}

	@GetMapping("/get-jobs-by-keyword")
	public ResponseEntity<?> getJobsByKeyWord(@RequestParam("keyWord") String keyWord){
		return ResponseEntity.ok(postService.getJobsByKeyword(keyWord));
	}
	@GetMapping("/get-posts-by-keyword")
	public ResponseEntity<?> getPostsByKeyword(@RequestParam("keyWord")  String keyword){
		return ResponseEntity.ok(postService.getAllPostsByKeyword(keyword));
	}
}
