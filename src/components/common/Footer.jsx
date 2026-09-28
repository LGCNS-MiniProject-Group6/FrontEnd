const footerLinks = ['공지사항', '개인정보처리방침', '이메일무단수집거부', '이용약관', '자주하는 질문']

function Footer() {
  return (
    <footer className="site-footer">
      <nav className="site-footer__links">
        {footerLinks.map((label) => (
          <a key={label} href="#" className={label === '개인정보처리방침' ? 'is-strong' : ''}>
            {label}
          </a>
        ))}
      </nav>
      <div className="site-footer__bottom">
        <strong className="site-footer__brand">지원UP</strong>
        <address className="site-footer__info">
          <span>LG CNS AM INSPIRE CAMP 6기</span>
          <span>문의 lgcns6th@email.com</span>
          <span>Copyright © 지원UP. All rights reserved.</span>
        </address>
      </div>
    </footer>
  )
}

export default Footer