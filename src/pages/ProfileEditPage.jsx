import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/common/AppLayout'
import Button from '../components/common/Button'
import Card from '../components/common/Card'
import Input from '../components/common/Input'
import { ROUTES } from '../constants/routes'
import { useAuth } from '../hooks/useAuth'

function ProfileEditPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  // 화면의 입력값을 state로 관리합니다.
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    region: user?.business?.region || '',
    industry: user?.business?.industry || '',
  })

  const setField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    navigate(ROUTES.MY_PAGE)
  }

  return (
    <AppLayout>
      <button className="back-link" type="button" onClick={() => navigate(-1)}>← 마이페이지로</button>
      <header className="page-heading">
        <span className="eyebrow">계정 및 사업정보</span>
        <h1>프로필 수정</h1>
        <p>맞춤 공고와 AI 검수 정확도를 위해 최신 정보를 유지해주세요.</p>
      </header>

      <form onSubmit={handleSubmit}>
        <Card className="profile-edit-card">
          <h2>기본정보</h2>
          <div className="form-grid">
            <Input label="이름" value={form.name} onChange={(e) => setField('name', e.target.value)} />
            <Input label="이메일" type="email" value={form.email} onChange={(e) => setField('email', e.target.value)} />
            <Input label="휴대폰번호" value={form.phone} onChange={(e) => setField('phone', e.target.value)} />
          </div>
        </Card>

        <Card className="profile-edit-card">
          <h2>사업정보</h2>
          <div className="form-grid">
            <Input label="사업장 지역" value={form.region} onChange={(e) => setField('region', e.target.value)} />
            <Input label="업종" value={form.industry} onChange={(e) => setField('industry', e.target.value)} />
          </div>
        </Card>

        <div className="form-actions">
          <Button variant="secondary" onClick={() => navigate(-1)}>취소</Button>
          <Button type="submit">수정 완료</Button>
        </div>
      </form>
    </AppLayout>
  )
}

export default ProfileEditPage
