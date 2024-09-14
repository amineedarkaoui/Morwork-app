import NavItem from "../navigation/NavItem";


export default function SettingsNav(props) {
    
    return (
        <div>
            <div className={`nav-bar radius elevation-1 ${props.isScrolling && "scroll"}`}>
                <NavItem
                    url="/settings/organization"
                    text="Organization"
                    line="ri:building-line"
                    fill="ri:building-fill"
                />
                
            </div>
        </div>
        
    )
}