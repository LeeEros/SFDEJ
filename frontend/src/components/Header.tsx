import logoSvg from "../assets/logo.svg"
import logoutSvg from "../assets/logout.svg"

export function Header() {
    return (
        <header>
            <img src={logoSvg} alt="logo" />

            <div>
                <span>Olá usuário!</span>

                <img src={logoutSvg} alt="ícone de logout/sair" />

            </div>
        </header>
    )
}