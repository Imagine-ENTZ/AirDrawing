import TopBanner from "./Component/TopBanner";
import MainHome from "./Component/MainHome";

const styles = {
  
    homepage: {
        height: "10vh",
        width: "75vh",
        textAlign: "center",
    }
}
function HomePage() {
    return (
        <div className="main_homepage">
            <TopBanner/>
            <MainHome/>
        </div>
    )
}

export default HomePage;