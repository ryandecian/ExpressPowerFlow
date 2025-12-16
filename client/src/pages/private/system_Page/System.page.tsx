/* Import des modules CSS */
import style from "../../stylePage.module.css";

/* Import des Components */
// import Nav_root_Layout from "../../../components/layout/nav_Layout/Nav.root.layout";
import System_Root from "../../../components/private/system/System.root";
// import Footer_root_layout from "../../../components/layout/footer_Layout/Footer.root.layout";

function System_Page() {
    return (
        <section className={`Home_Page ${style.Page}`}>
            <header id="top" className={style.Header}>
                {/* <Nav_root_Layout /> */}
            </header>
            <main className={style.Main}>
                <System_Root />
            </main>
            <footer className={style.Footer}>
                {/* <Footer_root_layout /> */}
            </footer>
        </section>
    );
}

export default System_Page;
