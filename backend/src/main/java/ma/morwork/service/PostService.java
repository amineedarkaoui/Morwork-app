package ma.morwork.service;


import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collector;
import java.util.stream.Collectors;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.CascadeType;
import lombok.RequiredArgsConstructor;
import ma.morwork.config.ServerMedia;
import ma.morwork.dto.*;
import ma.morwork.modele.Post;
import ma.morwork.modele.PostLike;
import ma.morwork.modele.User;
import ma.morwork.repository.PostLikeRepository;
import ma.morwork.modele.*;
import ma.morwork.repository.*;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;


import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import static java.util.stream.Collectors.toList;

@Service
@RequiredArgsConstructor
public class PostService {

    @Autowired
    private PostRepository postRepository;
    @Autowired
    private UserService userService;
    @Autowired
    private PostLikeRepository postLikeRepository;
    @Autowired
    private CommentLikeRepository commentLikeRepository;
    @Autowired
    private CommentRepository commentRepository;
    @Autowired
    private ReplyRepository replyRepository;
    @Autowired
    private ReplyLikeRepository replyLikeRepository;
    @Autowired
    private SaveRepository saveRepository;
    @Autowired
    private RepostRepository repostRepository;
    private final ModelMapper modelMapper;
    private final CompanyRepository companyRepository;
    private final JobPostRepository jobPostRepository;
    private final ServerMedia serverMedia;
    private static final String MyDirectory = "src/main/resources/static/media";

    public StandartPost savePost(StandartPost post) {
        return postRepository.save(post);
    }

    public Optional<StandartPost> getPostById(Long id) {
        return postRepository.findById(id);
    }
    public Optional<Repost> getRepostById(Long id){return repostRepository.findById(id);}

    public void deletePostById(Long id) {
        postRepository.deleteById(id);
    }

    public List<PostDTO> getAllPostsSortedByDate() {
        Sort sortByDate = Sort.by(Sort.Direction.DESC, "date");
        List<StandartPost> posts = postRepository.findAll(sortByDate);
        List<Repost> reposts = repostRepository.findAll(sortByDate);

        List<Post> combinedPosts = new ArrayList<>();
        combinedPosts.addAll(posts);
        combinedPosts.addAll(reposts);

        combinedPosts.sort(Comparator.comparing(Post::getDate).reversed());

        return convertToDTO(combinedPosts);
    }
    public List<PostDTO> getAllPostsSortedByDateByUserId(Long id) {
        List<StandartPost> posts = postRepository.findAllByAuthorId(id);
        List<Repost> reposts = repostRepository.findAllByAuthorId(id);

        List<Post> combinedPosts = new ArrayList<>();
        combinedPosts.addAll(posts);
        combinedPosts.addAll(reposts);

        List<Post> sortedPosts = combinedPosts.stream()
                .sorted(Comparator.comparing(Post::getDate).reversed())
                .collect(Collectors.toList());

        return convertToDTO(sortedPosts);
    }

    public List<PostLikeDTO> getAllPostLikesByPostId(Long id) {
        List<PostLike> postsLike = postLikeRepository.findAllByPostId(id);
        List<PostLikeDTO> likes = new ArrayList<>();
        for (PostLike like : postsLike) {
            PostLikeDTO postlike = new PostLikeDTO();
            postlike.setUser(like.getUser());
            postlike.setPostId(like.getPost().getId());
            postlike.setDate(like.getDate());
            postlike.setId(like.getId());
            likes.add(postlike);
        }
        return likes;
    }

    //***
    public PostDTO getPost(Long id, String postType) {
        try {
            if (postType.equals("STANDART_POST")) {
                return convertToDTO(postRepository.findById(id)
                        .orElseThrow(() -> new NoSuchElementException("Post not found")));
            } else {
                return convertToDTO(repostRepository.findById(id)
                        .orElseThrow(() -> new NoSuchElementException("Repost not found")));
            }
        } catch (NoSuchElementException ex) {
            ex.printStackTrace();
            throw ex;
        } catch (Exception ex) {
            ex.printStackTrace();
            throw new RuntimeException("An error occurred while fetching the post", ex);
        }
    }


    public void addComment(Long postId, Long userId, String content, String postType) {
        if(postType.equals("STANDART_POST")){
            Optional<StandartPost> postOptional = postRepository.findById(postId);
            if (postOptional.isPresent()) {
                StandartPost post = postOptional.get();

                Comment comment = new Comment();
                comment.setUser(userService.getUserById(userId));
                comment.setContent(content);
                comment.setPost(postRepository.findById(postId).orElseThrow());
                comment.setDate(LocalDateTime.now());

                post.getComments().add(comment);
                postRepository.save(post);
            } else {
//            throw new Exception("Post not found with ID: " + postId);
            }
        }else{
            Optional<Repost> repostOptional = repostRepository.findById(postId);
            if(repostOptional.isPresent()){
                Repost repost = repostOptional.get();
                Comment comment = new Comment();
                comment.setUser(userService.getUserById(userId));
                comment.setContent(content);
                comment.setPost(repostRepository.findById(postId).orElseThrow());
                comment.setDate(LocalDateTime.now());

                repost.getComments().add(comment);
                repostRepository.save(repost);
            }
        }


    }



    public PostDTO convertToDTO(Post post) {
        if (post instanceof StandartPost standartPost) {
            StandartPostDTO standartPostDTO = new StandartPostDTO();

            standartPostDTO.setId(standartPost.getId());
            standartPostDTO.setUserId(standartPost.getAuthor().getId());
            standartPostDTO.setDate(standartPost.getDate());
            standartPostDTO.setContent(standartPost.getContent());
            standartPostDTO.setImage(standartPost.getImage());
            standartPostDTO.setVideo(standartPost.getVideo());
            standartPostDTO.setUserProfilePicture(standartPost.getAuthor().getProfilePicture());

            List<Repost> reposts = standartPost.getReposts();
            List<RepostDTO> repostDTOS = new ArrayList<>();
            for(Repost repost : reposts){
                RepostDTO repostDTO = new RepostDTO();
                repostDTO.setId(repost.getId());
                repostDTO.setDate(repost.getDate());
                repostDTO.setType(repost.getType());
                repostDTO.setUserId(repost.getAuthor().getId());

                repostDTO.setTitle(repost.getTitle());
                repostDTO.setSaves(saveRepository.findAllByPostId(repost.getId()));
                repostDTO.setFirstName(repost.getFirstName());
                repostDTO.setLastName(repost.getLastName());
                repostDTOS.add(repostDTO);
            }
            standartPostDTO.setReposts(repostDTOS);

            standartPostDTO.setSaves(saveRepository.findAllByPostId(standartPost.getId()));

            List<PostLikeDTO> likes = standartPost.getLikes().stream()
                    .map(like -> {
                        PostLikeDTO postLikeDTO = new PostLikeDTO();
                        postLikeDTO.setUser(like.getUser());
                        postLikeDTO.setPostId(like.getPost().getId());
                        postLikeDTO.setDate(like.getDate());
                        postLikeDTO.setId(like.getId());
                        return postLikeDTO;
                    })
                    .collect(toList());

            standartPostDTO.setLikes(likes);

            List<CommentDTO> commentDTOs = new ArrayList<>();
            for (Comment comment : standartPost.getComments()) {
                CommentDTO commentDTO = convertCommentToDTO(comment);
                commentDTOs.add(commentDTO);
            }
            standartPostDTO.setComments(commentDTOs);

            standartPostDTO.setTitle(userService.getUserById(standartPost.getAuthor().getId()).getTitle());
            standartPostDTO.setFirstName(userService.getUserById(standartPost.getAuthor().getId()).getFirstName());
            standartPostDTO.setLastName(userService.getUserById(standartPost.getAuthor().getId()).getLastName());
            standartPostDTO.setType(PostType.STANDART_POST);
            return standartPostDTO;
        } else if(post instanceof Repost){
            Repost repost = (Repost) post;
            RepostDTO repostDTO = new RepostDTO();
            repostDTO.setId(repost.getId());
            repostDTO.setDate(repost.getDate());
            repostDTO.setSaves(saveRepository.findAllByPostId(repost.getId()));
            repostDTO.setOriginalPost((StandartPostDTO) convertToDTO(repost.getOriginalPost()));
            repostDTO.setUserId(repost.getAuthor().getId());
            List<CommentDTO> commentDTOs = new ArrayList<>();
            for (Comment comment : repost.getComments()) {
                CommentDTO commentDTO = convertCommentToDTO(comment);
                commentDTOs.add(commentDTO);
            }
            repostDTO.setComments(commentDTOs);

            repostDTO.setTitle(repost.getTitle());

            repostDTO.setFirstName(repost.getFirstName());
            repostDTO.setLastName(repost.getLastName());
            repostDTO.setType(PostType.REPOSTED);
            repostDTO.setUserProfilePicture(repost.getAuthor().getProfilePicture());

            return repostDTO;
        }
        return null;
    }


    private CommentDTO convertCommentToDTO(Comment comment) {
        CommentDTO commentDTO = new CommentDTO();
        commentDTO.setUser(comment.getUser());
        commentDTO.setId(comment.getId());
        commentDTO.setDate(comment.getDate());
        commentDTO.setContent(comment.getContent());
        commentDTO.setPost(comment.getPost());
        commentDTO.setLikes(comment.getLikes());


        List<ReplyDTO> replyDTOs = comment.getReplies().stream()
                .map(reply -> {
                    ReplyDTO replyDTO = new ReplyDTO();
                    replyDTO.setId(reply.getId());
                    replyDTO.setContent(reply.getContent());
                    replyDTO.setDate(reply.getDate());
                    replyDTO.setComment(reply.getComment());
                    replyDTO.setUser(reply.getUser());
                    replyDTO.setLikes(reply.getLikes());
                    return replyDTO;
                })
                .collect(Collectors.toList());
        commentDTO.setReplies(replyDTOs);

        return commentDTO;
    }

    private List<PostDTO> convertToDTO(List<Post> posts) {
        return posts.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public boolean likePost(Long postId, Long userId, String postType) {
        Optional<User> userOptional = Optional.ofNullable(userService.getUserById(userId));
        if(postType.equals("STANDART_POST") && userOptional.isPresent()){
            User user = userOptional.get();

            StandartPost standartPost = postRepository.findById(postId).orElseThrow();
            Optional<PostLike> existingLike = standartPost.getLikes().stream()
                    .filter(like -> like.getUser().getId() == userId)
                    .findFirst();
            if(existingLike.isEmpty()){
                PostLike postLike = new PostLike();
                postLike.setUser(user);
                postLike.setDate(LocalDateTime.now());
                postLike.setPost(standartPost);
                standartPost.getLikes().add(postLike);
            postLikeRepository.save(postLike);
            return true;
            }else{
                Long postLikeId = existingLike.get().getId();
                System.out.println(postLikeId);
                postLikeRepository.deleteById(postLikeId);
                return false;
            }
        }else if(postType.equals("REPOSTED") && userOptional.isPresent()) {
            User user = userOptional.get();

            Repost repost = repostRepository.findById(postId).orElseThrow();

            Optional<PostLike> existingLike = repost.getLikes().stream()
                    .filter(like -> like.getUser().getId() == userId)
                    .findFirst();
            if(existingLike.isEmpty()){
                PostLike postLike = new PostLike();
                postLike.setUser(user);
                postLike.setDate(LocalDateTime.now());
                postLike.setPost(repost);
                repost.getLikes().add(postLike);
                postLikeRepository.save(postLike);
                return true;
            }else{
                Long postLikeId = existingLike.get().getId();
                System.out.println(postLikeId);
                postLikeRepository.deleteById(postLikeId);
                return false;
            }
        }
    return false;
    }

    @Transactional
    public void likeComment(Long commentId, Long userId) {
        Comment comment = commentRepository.findById(commentId).orElseThrow();

        Optional<CommentLike> existingLike = comment.getLikes().stream()
                .filter(like -> like.getUser().getId() == userId)
                .findFirst();

        if (existingLike.isPresent()) {
            comment.getLikes().remove(existingLike.get());
            commentLikeRepository.delete(existingLike.get());
        } else {
            CommentLike commentLike = new CommentLike();
            commentLike.setUser(userService.getUserById(userId));
            commentLike.setComment(comment);
            commentLike.setDate(LocalDateTime.now());
            commentLike.setPost(comment.getPost());
            comment.getLikes().add(commentLike);
            commentRepository.save(comment);
        }
    }

    public List<CommentLikeDTO> getAllCommentLikesByPostId(Long postId) {
        List<CommentLike> commentLikes = commentLikeRepository.findAllByPostId(postId);
        return commentLikes.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private CommentLikeDTO convertToDTO(CommentLike commentLike) {
        CommentLikeDTO dto = new CommentLikeDTO();
        dto.setId(commentLike.getId());
        dto.setDate(commentLike.getDate());
        dto.setUser(commentLike.getUser());
        System.out.println(commentLike.getComment().getPost().getId());
        dto.setComment(commentLike.getComment());
        dto.setPost(commentLike.getPost());
        return dto;
    }

    @Transactional
    public void unlikePost(StandartPost post, User user) {

        Optional<PostLike> postLikeOptional = post.getLikes().stream()
                .filter(like -> like.getUser().getId() == (user.getId()))
                .findFirst();


        postLikeOptional.ifPresent(postLike -> {
            post.getLikes().remove(postLike);
            postLikeRepository.delete(postLike);
        });
    }

    @Transactional
    public void addReply(Long commentId, Long userId, String content) {
        Optional<Comment> commentOptional = commentRepository.findById(commentId);
        User user = userService.getUserById(userId);
        if (commentOptional.isPresent()) {
            Comment comment = commentOptional.get();

            Reply reply = new Reply();
            reply.setContent(content);
            reply.setComment(comment);
            reply.setUser(user);
            reply.setDate(LocalDateTime.now());

            comment.getReplies().add(reply);
            commentRepository.save(comment);
        } else {
            throw new IllegalArgumentException("Comment not found with ID: " + commentId);
        }
    }

    @Transactional
    public void likeReply(Long replyId, Long userId) {
        Reply reply = replyRepository.findById(replyId).orElseThrow();

        Optional<ReplayLike> existingLike = reply.getLikes().stream()
                .filter(like -> like.getUser().getId() == userId)
                .findFirst();

        if (existingLike.isPresent()) {
            reply.getLikes().remove(existingLike.get());
            replyLikeRepository.delete(existingLike.get());
        } else {
            ReplayLike replyLike = new ReplayLike();
            replyLike.setUser(userService.getUserById(userId));
            replyLike.setReply(reply);
            replyLike.setDate(LocalDateTime.now());
            replyLikeRepository.save(replyLike);
        }
    }

    @Transactional
    public <T> void deleteEntityById(Long id, Class<T> entityType) {
        if (entityType.equals(StandartPost.class)) {
            postRepository.deleteById(id);
        } else if (entityType.equals(Comment.class)) {

            System.out.println("Before deleting: " + id);
            commentRepository.deleteById(id);
            System.out.println("After deleting: " + id);
        } else if (entityType.equals(Reply.class)) {

            replyRepository.deleteById(id);
        } else if (entityType.equals(Repost.class)) {
            repostRepository.deleteById(id);
        } else {
            throw new IllegalArgumentException("Unsupported entity type");
        }
    }



    @Transactional
    public <T> void updateEntityById(Long id, String content, MultipartFile image, Class<T> entityType) {
        if (entityType.equals(StandartPost.class)) {
            Optional<StandartPost> optionalPost = postRepository.findById(id);
            if (optionalPost.isPresent()) {
                StandartPost post = optionalPost.get();
                post.setContent(content);
                if (image != null) {
                    try {
                        if (!Files.exists(Paths.get(MyDirectory))) {
                            Files.createDirectories(Paths.get(MyDirectory));
                        }
                        String imageName = image.getOriginalFilename();
                        Path imagePath = Paths.get(MyDirectory, imageName);
                        Files.write(imagePath, image.getBytes());
                        String imageUrl = MyDirectory + "/" + imageName;
                        post.setImage(imageName);
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
                postRepository.save(post);
            } else {
                throw new IllegalArgumentException("StandartPost with ID " + id + " not found");
            }
        } else if (entityType.equals(Comment.class)) {
            Optional<Comment> optionalComment = commentRepository.findById(id);
            if (optionalComment.isPresent()) {
                Comment comment = optionalComment.get();
                comment.setContent(content);
                commentRepository.save(comment);
            } else {
                throw new IllegalArgumentException("Comment with ID " + id + " not found");
            }
        } else if (entityType.equals(Reply.class)) {
            Optional<Reply> optionalReply = replyRepository.findById(id);
            if (optionalReply.isPresent()) {
                Reply reply = optionalReply.get();
                reply.setContent(content);
                replyRepository.save(reply);
            } else {
                throw new IllegalArgumentException("Reply with ID " + id + " not found");
            }
        } else {
            throw new IllegalArgumentException("Unsupported entity type");
        }
    }
    @Transactional
    public void savePost(Long userId, Long postId, String postType){
        Save saveOptional = saveRepository.findByUserIdAndPostId(userId,postId);
        if(saveOptional == null){
            Save save = new Save();
            if(postType.equals("STANDART_POST")) {

                save.setDate(LocalDateTime.now());
                save.setPost(postRepository.findById(postId).orElseThrow());
                save.setUser(userService.getUserById(userId));

            }else{
                save.setDate(LocalDateTime.now());
                save.setPost(repostRepository.findById(postId).orElseThrow());
                save.setUser(userService.getUserById(userId));
            }
            saveRepository.save(save);
        }else {
            saveRepository.deleteById(saveOptional.getId());
        }
    }


    public void repost(Long postId, Long userId){
        Optional<StandartPost> postOptional = postRepository.findById(postId);
        if(postOptional.isPresent()){
            Repost repost = new Repost();
            repost.setAuthor(userService.getUserById(userId));
            repost.setOriginalPost(postOptional.get());
            repost.setDate(LocalDateTime.now());
            repost.setFirstName(repost.getAuthor().getFirstName());
            repost.setLastName(repost.getAuthor().getLastName());
            repost.setTitle(userService.getUserById(userId).getTitle());
            repost.setType(PostType.REPOSTED);

            repostRepository.save(repost);
        }
    }
    public List<Repost> getReposts(){
        return repostRepository.findAll();
    }
    public  Repost getRepost(Long id){
        return repostRepository.findById(id).orElseThrow();
    }

    public void postJobOffer(Long id, JobPostDTO jobPostDTO) {
        JobPost jobPost = modelMapper.map(jobPostDTO, JobPost.class);
        Company company = companyRepository.findById(id).get();
        jobPost.setCompany(company);
        jobPostRepository.save(jobPost);
    }

    public List<JobPostDTO> getCompanyOffers(Long id) throws Exception {
        Company company = companyRepository.findById(id).get();
        List<JobPost> jobPosts = company.getJobOffers();
        List<JobPostDTO> jobPostDTOS = jobPosts.stream()
                .map(jobPost -> {
                    JobPostDTO job = modelMapper.map(jobPost, JobPostDTO.class);
                    CompanyDTO companyDTO = job.getCompany();
                    companyDTO.setImage(serverMedia.serveMedia(companyDTO.getImage()));
                    job.setCompany(companyDTO);
                    return job;
                })
                .toList();
        for (JobPostDTO job : jobPostDTOS) {
            String output = new ObjectMapper().writeValueAsString(job);
            System.out.println(output);
        }

        return jobPostDTOS;
    }

    public List<JobPostDTO> getAllOffers() throws Exception {
        List<JobPost> jobPosts = jobPostRepository.findAll();
        List<JobPostDTO> jobPostDTOS = jobPosts.stream()
                .map(jobPost -> {
                    JobPostDTO job = modelMapper.map(jobPost, JobPostDTO.class);
                    CompanyDTO companyDTO = job.getCompany();
                    companyDTO.setImage(serverMedia.serveMedia(companyDTO.getImage()));
                    job.setCompany(companyDTO);
                    return job;
                })
                .toList();

        return jobPostDTOS;
    }

    public List<JobPostDTO> getJobsByKeyword(String keyWord){
        List<JobPost> jobPosts = jobPostRepository.findByTitleContainingIgnoreCase(keyWord);
        List<JobPostDTO> jobPostDTOS = jobPosts.stream()
                .map(jobPost -> {
                    JobPostDTO job = modelMapper.map(jobPost, JobPostDTO.class);
                    CompanyDTO companyDTO = job.getCompany();
                    companyDTO.setImage(serverMedia.serveMedia(companyDTO.getImage()));
                    job.setCompany(companyDTO);
                    return job;
                })
                .toList();

        return jobPostDTOS;
    }

    public List<PostDTO> getAllPostsByKeyword(String keyword){
        Sort sortByDate = Sort.by(Sort.Direction.DESC, "date");
        List<StandartPost> posts = postRepository.findByContentContainingIgnoreCase(sortByDate, keyword);
        List<Repost> reposts = repostRepository.findByOriginalPostContentContainingIgnoreCase(sortByDate, keyword);

        List<Post> combinedPosts = new ArrayList<>();
        combinedPosts.addAll(posts);
        combinedPosts.addAll(reposts);

        combinedPosts.sort(Comparator.comparing(Post::getDate).reversed());

        return convertToDTO(combinedPosts);
    }

}

