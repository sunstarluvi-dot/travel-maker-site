"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"

// ---- FAQ (10) ----
const FAQ: { id: number; q: string; a: string }[] = [
  { id: 1, q: "고객센터 전화번호가 궁금해요", a: "고객센터 전화번호는 02-1234-5678 입니다." },
  { id: 2, q: "상품 등록이 안돼요", a: "코스 등록 페이지에서 제목/지역/일정/이미지 등 필수 항목을 확인해 주세요." },
  { id: 3, q: "가격은 자동 계산되나요?", a: "교통비/입장료/숙박을 입력하면 총액이 자동 계산됩니다." },
  { id: 4, q: "반려동물 코스만 보고 싶어요", a: "상단 카테고리에서 '반려동물'을 선택하면 관련 코스만 볼 수 있어요." },
  { id: 5, q: "여행 코스 수정은 어떻게 하나요?", a: "내 코스 상세 오른쪽 상단 '수정' 버튼으로 편집할 수 있어요." },
  { id: 6, q: "구독은 어떻게 하나요?", a: "크리에이터 프로필의 '구독' 버튼을 누르면 새 코스 알림을 받아요." },
  { id: 7, q: "알림 키워드 설정", a: "검색창 우측 종 아이콘에서 키워드/지역 알림을 설정할 수 있어요." },
  { id: 8, q: "결제는 지원하나요?", a: "졸업작품 데모라 결제는 미지원, 문의만 가능합니다." },
  { id: 9, q: "인증 마크가 뭔가요?", a: "할랄/공식 인증 정보를 카드와 상세페이지에서 동일하게 확인할 수 있어요." },
  { id: 10, q: "문의 남기고 싶어요", a: "아래 '고객센터 문의하기'를 눌러 티미와 대화를 시작해 주세요." },
]

// ---- 간단 스크립트 응답 ----
const SCRIPT: { test: (t: string) => boolean; reply: string }[] = [
  { test: (t) => /전화|번호|고객센터/.test(t), reply: "고객센터 02-1234-5678 (평일 09:00~18:00)." },
  { test: (t) => /가격|비용|얼마/.test(t), reply: "가격은 예상 총액(교통/입장/숙박 합)으로 표시돼요." },
  {
    test: (t) => /반려동물|펫|강아지|고양이/.test(t),
    reply: "'반려동물' 카테고리에서 관련 코스를 확인해 보세요.",
  },
  { test: (t) => /등록|업로드|올리/.test(t), reply: "코스 등록 페이지에서 제목/지역/일정/이미지를 입력해 주세요." },
  { test: (t) => /수정|편집/.test(t), reply: "내 코스 상세의 '수정' 버튼으로 변경할 수 있어요." },
]

export default function ChatbotPanel() {
  const [open, setOpen] = useState(false)
  const [chat, setChat] = useState(false)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [messages, setMessages] = useState<{ from: "bot" | "me"; text: string }[]>([
    { from: "bot", text: "안녕하세요! 저는 티미예요. TRAVEL MAKER 사용을 도와드릴게요 😊" },
  ])
  const [input, setInput] = useState("")
  const chatEndRef = useRef<HTMLDivElement>(null)
  const attached = useRef(false)
  const [showFallback, setShowFallback] = useState(false)

  useEffect(() => {
    if (attached.current) return
    attached.current = true

    const btn = document.getElementById("chatbot-icon")

    if (!btn) {
      // If #chatbot-icon doesn't exist, show fallback button
      setShowFallback(true)
      return
    }

    const onClick = () => {
      setOpen(true)
      setChat(false)
    }

    btn.addEventListener("click", onClick)
    return () => {
      if (btn) {
        btn.removeEventListener("click", onClick)
      }
    }
  }, [])

  useEffect(() => {
    if (chat && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, chat])

  const handleSend = () => {
    const text = input.trim()
    if (!text) return
    setMessages((prev) => [...prev, { from: "me", text }])
    setInput("")

    const match = SCRIPT.find((s) => s.test(text))
    const reply = match ? match.reply : "죄송해요, 잘 이해하지 못했어요. 다시 질문해 주시겠어요?"
    setTimeout(() => {
      setMessages((prev) => [...prev, { from: "bot", text: reply }])
    }, 600)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {showFallback && (
        <button
          onClick={() => {
            setOpen(true)
            setChat(false)
          }}
          className="fixed bottom-5 right-5 z-[1000] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-[#FF6F42] to-[#3A9CFD] text-white shadow-lg hover:shadow-xl transition-shadow"
          aria-label="도움이 필요하신가요?"
          data-origin="global"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
            />
          </svg>
        </button>
      )}

      {open && (
        <div className="fixed bottom-24 right-5 z-[999] w-[380px] max-w-[92vw] overflow-hidden rounded-2xl bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-[#FF6F42] to-[#3A9CFD] px-4 py-3 text-white">
            <div className="font-bold">티미 - TRAVEL MAKER 도우미</div>
            <button onClick={() => setOpen(false)} aria-label="닫기" className="text-xl hover:opacity-80">
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="max-h-[500px] overflow-y-auto p-4">
            {!chat ? (
              // FAQ View
              <div className="space-y-3">
                <p className="text-sm text-gray-600 mb-4">
                  안녕하세요! 저는 <b>티미</b>예요. 자주 묻는 질문을 확인하거나 고객센터와 대화를 시작해 보세요 😊
                </p>

                {/* FAQ List */}
                <div className="space-y-2">
                  {FAQ.map((item) => (
                    <div key={item.id} className="border rounded-lg overflow-hidden">
                      <button
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors flex items-center justify-between"
                        onClick={() => setExpandedFaq(expandedFaq === item.id ? null : item.id)}
                      >
                        <span className="text-sm font-medium">{item.q}</span>
                        <span className="text-gray-400">{expandedFaq === item.id ? "−" : "+"}</span>
                      </button>
                      {expandedFaq === item.id && (
                        <div className="px-3 py-2 bg-gray-50 text-sm text-gray-700 border-t">{item.a}</div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Customer Service Button */}
                <button
                  onClick={() => setChat(true)}
                  className="w-full mt-4 rounded-xl bg-gradient-to-r from-[#FF6F42] to-[#3A9CFD] px-4 py-3 text-white font-medium hover:opacity-90 transition-opacity"
                >
                  고객센터 문의하기
                </button>
              </div>
            ) : (
              // Chat View
              <div className="space-y-3">
                {/* Back Button */}
                <button
                  onClick={() => setChat(false)}
                  className="text-sm text-[#3A9CFD] hover:underline flex items-center gap-1 mb-2"
                >
                  ← FAQ로 돌아가기
                </button>

                {/* Messages */}
                <div className="space-y-3 mb-4 max-h-[320px] overflow-y-auto">
                  {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                          msg.from === "me"
                            ? "bg-gradient-to-r from-[#FF6F42] to-[#3A9CFD] text-white"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                {/* Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="메시지를 입력하세요..."
                    className="flex-1 rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3A9CFD]"
                  />
                  <button
                    onClick={handleSend}
                    className="rounded-xl bg-gradient-to-r from-[#FF6F42] to-[#3A9CFD] px-4 py-2 text-white font-medium hover:opacity-90 transition-opacity"
                  >
                    전송
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
