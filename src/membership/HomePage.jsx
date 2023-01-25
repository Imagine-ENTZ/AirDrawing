import TopBanner from "./component/TopBanner";
import MainHome from "./component/MainHome";
import Snow from "./component/SnowCopy";

const styles = {
  
    homepage: {
        height: "10vh",
        width: "75vh",
        textAlign: "center",
    }
}
function HomePage() {
    return (
        <div className="hero">
            <Snow />
        <div className="main_homepage">
            <TopBanner/>
            <MainHome/>
        </div>
        </div>
    )
}

export default HomePage;