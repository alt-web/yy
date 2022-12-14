import type { NextPage } from "next"
import Router from "next/router"
import { useEffect } from "react"
import { withIronSessionSsr } from "iron-session/next"
import { sessionOptions } from "lib/session"
import styles from "styles/admin.module.css"
import ListOfPhotos from "lib/admin/photos"
import PasswordManager from "lib/admin/password"
import Artists from "lib/admin/artists"
import { LogoutAPI } from "./api/logout"
import Meta from "lib/meta"

type PageProps = {
    isAdmin: boolean
}

export const getServerSideProps = withIronSessionSsr(async (context) => {
    const user = context.req.session.user

    const props: PageProps = {
        isAdmin: user !== undefined,
    }
    return { props }
}, sessionOptions)

const AdminPage: NextPage<PageProps> = (props) => {
    // Redirect to login page
    // If user is not authorized
    useEffect(() => {
        if (!props.isAdmin) {
            setTimeout(() => Router.push("/login"), 1000)
        }
    }, [props.isAdmin])

    if (props.isAdmin)
        return (
            <div className={styles.Container}>
                <Meta title="Admin" />
                <div>Hi, admin</div>
                <ListOfPhotos />
                <Artists />
                <PasswordManager />
                <button className={styles.Button} onClick={() => logout()}>
                    Logout
                </button>
            </div>
        )

    return (
        <div className={styles.Container}>
            <Meta title="Redirecting" />
            You are not the admin
        </div>
    )
}

const logout = async () => {
    const response = await fetch("/api/logout")
    const res: LogoutAPI = await response.json()
    if (res.ok) Router.push("/login")
}

export default AdminPage
