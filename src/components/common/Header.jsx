import { NavLink, useNavigate } from 'react-router-dom'
import supportUpLogo from '../../assets/support-up-logo.png'
import { ROUTES } from '../../constants/routes'
import { useAuth } from '../../hooks/useAuth'
import Button from './Button'

function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate(ROUTES.LOGIN, { replace: true })
  }

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <NavLink className="brand" to={ROUTES.HOME} aria-label="지원UP 홈">
          <img className="brand__logo" src={supportUpLogo} alt="" />
          지원UP
        </NavLink>
        <nav className="site-nav" aria-label="주요 메뉴">
          <NavLink to={ROUTES.HOME}>홈</NavLink>
          <NavLink to={ROUTES.PROGRAMS}>사업 찾기</NavLink>
          <NavLink to={ROUTES.MY_PAGE}>마이페이지</NavLink>
        </nav>
        <div className="site-header__user">
          <span>{user?.name ?? '사용자'}님</span>
          <Button variant="ghost" size="small" onClick={handleLogout}>로그아웃</Button>
        </div>
      </div>
    </header>
  )
}

export default Header
