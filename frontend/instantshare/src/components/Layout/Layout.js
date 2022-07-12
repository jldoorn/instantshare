import Navigation from "../Navigation"


const Layout = ({ children }) => {
    return (
        <>
            <Navigation></Navigation>
            <main>{children}</main>
        </>
    )
}

export default Layout