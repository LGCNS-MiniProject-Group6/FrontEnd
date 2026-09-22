import { useState } from 'react'
import Button from '../common/Button'
import ChatMessage from './ChatMessage'

const suggestedQuestions = [
  '왜 추가 확인이 필요해?',
  '필요한 서류는?',
  '신청방법 알려줘',
  '공고 쉽게 설명해줘',
  '자부담이 있나요?',
]

// 현재 챗봇 답변은 화면 확인용 임시 응답입니다.
const getMockAnswer = (question) => {
  if (question.includes('서류')) {
    return '현재 공고 기준으로 사업자등록증, 매출 증빙자료, 지원 신청서를 먼저 준비해주세요. 세부 제출 형식은 원문 공고에서 확인해야 합니다.'
  }
  if (question.includes('신청')) {
    return '사업 신청 시스템에서 온라인으로 접수합니다. 접수 전 신청기간과 첨부파일 형식을 원문 공고에서 다시 확인해주세요.'
  }
  return '현재 입력된 정보와 공고문만으로 확인할 수 없는 조건이 있어 추가 확인이 필요합니다. 특히 중복지원 이력과 세금 체납 여부를 확인해주세요.'
}

function ChatPanel({ programTitle }) {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: '안녕하세요. 현재 AI 검수 결과에서 추가 확인이 필요한 항목은 중복지원, 세금 체납, 매출 세부기준입니다. 어떤 항목부터 자세히 알려드릴까요?',
    },
  ])

  const sendMessage = (text) => {
    const normalized = text.trim()
    if (!normalized) return
    setMessages((current) => [
      ...current,
      { role: 'user', text: normalized },
      { role: 'assistant', text: getMockAnswer(normalized) },
    ])
    setInput('')
  }

  return (
    <aside className="chat-panel" aria-label="공고 AI 도우미">
      <div className="chat-panel__header">
        <div><span className="eyebrow">실시간</span><h2>공고 AI 도우미</h2></div>
        <p>{programTitle}</p>
        <small>공고문과 현재 AI 검수 결과를 기준으로 답변합니다.</small>
      </div>
      <div className="chat-panel__suggestions">
        <strong>추천 질문</strong>
        <div>
          {suggestedQuestions.map((question) => (
            <button type="button" key={question} onClick={() => sendMessage(question)}>{question}</button>
          ))}
        </div>
      </div>
      <div className="chat-panel__messages" aria-live="polite">
        {messages.map((message, index) => (
          <ChatMessage key={`${message.role}-${index}`} role={message.role}>{message.text}</ChatMessage>
        ))}
      </div>
      <form
        className="chat-panel__composer"
        onSubmit={(event) => {
          event.preventDefault()
          sendMessage(input)
        }}
      >
        <label className="sr-only" htmlFor="chat-input">질문 입력</label>
        <input
          id="chat-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="질문을 입력하세요"
        />
        <Button type="submit" aria-label="질문 보내기">↑</Button>
      </form>
    </aside>
  )
}

export default ChatPanel
