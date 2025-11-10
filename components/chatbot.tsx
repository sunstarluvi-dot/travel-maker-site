"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { X, ChevronDown, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ChatbotProps {
  onClose: () => void
}

interface Message {
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

export default function Chatbot({ onClose }: ChatbotProps) {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [showChat, setShowChat] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "안녕하세요! 😊 저는 **TRAVEL MAKER**의 챗봇 **티미**입니다! 무엇을 도와드릴까요? 언제든지 질문해 주세요!",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const chatBoxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight
    }
  }, [messages])

  const faqData = [
    {
      question: "고객센터 전화번호는 무엇인가요?",
      answer: "고객센터 전화번호는 02-1234-5678입니다.",
    },
    {
      question: "상품 등록이 안 돼요",
      answer: "상품 등록에 문제가 있으신가요? 잠시 후 다시 시도해 주세요. 문제가 지속되면 고객센터로 문의해 주세요.",
    },
    {
      question: "가격은 자동 계산되나요?",
      answer: "가격은 상품별로 자동 계산됩니다. 각 상품 페이지에서 가격 정보를 확인하실 수 있습니다.",
    },
    {
      question: "반려동물 코스만 보고 싶어요",
      answer: "반려동물 동반이 가능한 코스를 확인하려면 필터를 사용해 주세요.",
    },
    {
      question: "여행 코스 수정은 어떻게 하나요?",
      answer: "여행 코스를 수정하려면 코스 설정 페이지로 이동하세요.",
    },
    {
      question: "결제 방법은 무엇인가요?",
      answer: "저희는 신용카드 및 계좌이체 등 다양한 결제 방법을 지원합니다.",
    },
    {
      question: "예약 변경은 어떻게 하나요?",
      answer: "예약을 변경하려면 예약 페이지로 가거나 고객센터에 문의하세요.",
    },
    {
      question: "취소 정책은 어떻게 되나요?",
      answer: "취소 정책은 예약 페이지에 명시되어 있습니다. 해당 내용을 참고해 주세요.",
    },
    {
      question: "특정 지역만 여행하고 싶은데 어떻게 해야 하나요?",
      answer: "특정 지역을 여행하고 싶다면 여행 패키지에서 지역 필터를 사용해 주세요.",
    },
    {
      question: "상품 정보가 부족해요, 더 자세히 알 수 있나요?",
      answer: "상품 페이지에서 더 많은 정보를 확인하시거나, 고객센터에 문의하시면 도움을 드릴 수 있습니다.",
    },
  ]

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index)
  }

  const sendMessage = () => {
    const message = inputValue.trim()
    if (message !== "") {
      // Add user message
      const userMessage: Message = {
        text: message,
        sender: "user",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, userMessage])
      setInputValue("")

      // Simulate bot response after a short delay
      setTimeout(() => {
        const botMessage: Message = {
          text: "감사합니다! 고객센터 상담원이 곧 답변드리겠습니다. 잠시만 기다려 주세요.",
          sender: "bot",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botMessage])
      }, 1000)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage()
    }
  }

  if (showChat) {
    return (
      <div className="fixed bottom-24 right-6 z-50 w-80 h-[500px] rounded-2xl bg-white soft-shadow-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#3A9CFD] to-[#FF6F42] p-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            <h3 className="font-bold">티미 - 고객센터</h3>
          </div>
          <button onClick={onClose} className="hover:opacity-80 transition-opacity">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div ref={chatBoxRef} className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-3">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`${
                message.sender === "bot"
                  ? "bg-white rounded-lg p-3 soft-shadow-sm"
                  : "bg-gradient-to-r from-[#3A9CFD] to-[#FF6F42] text-white rounded-lg p-3 ml-auto max-w-[80%]"
              }`}
            >
              <p className={`text-sm ${message.sender === "bot" ? "text-gray-700" : "text-white"}`}>{message.text}</p>
              <p className={`text-xs mt-1 ${message.sender === "bot" ? "text-gray-400" : "text-white/70"}`}>
                {message.sender === "bot" ? "티미" : "나"} -{" "}
                {message.timestamp.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          ))}
        </div>

        <div className="p-4 border-t bg-white">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="메시지를 입력하세요..."
              className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button onClick={sendMessage} size="sm" className="bg-gradient-to-r from-[#3A9CFD] to-[#FF6F42]">
              전송
            </Button>
          </div>
          <button onClick={() => setShowChat(false)} className="text-xs text-primary hover:underline mt-2">
            ← FAQ로 돌아가기
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-24 right-6 z-50 w-80 h-[500px] rounded-2xl bg-white soft-shadow-lg overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#3A9CFD] to-[#FF6F42] p-4 flex items-center justify-between text-white">
        <div>
          <h3 className="font-bold">티미</h3>
          <p className="text-xs opacity-90 leading-relaxed">안녕하세요! 😊 저는 TRAVEL MAKER의 챗봇 티미입니다!</p>
        </div>
        <button onClick={onClose} className="hover:opacity-80 transition-opacity">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* FAQ Section */}
      <div className="flex-1 p-4 overflow-y-auto">
        <p className="text-sm font-semibold mb-3">자주 묻는 질문</p>
        <div className="space-y-2">
          {faqData.map((faq, index) => (
            <div key={index} className="border rounded-lg overflow-hidden">
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors text-left"
              >
                <span className="text-sm font-medium">{faq.question}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${expandedFaq === index ? "rotate-180" : ""}`} />
              </button>
              {expandedFaq === index && (
                <div className="px-3 pb-3 pt-1 bg-gray-50 border-t">
                  <p className="text-sm text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer with Customer Service Button */}
      <div className="p-4 border-t bg-white">
        <Button
          onClick={() => setShowChat(true)}
          className="w-full bg-gradient-to-r from-[#3A9CFD] to-[#FF6F42] hover:opacity-90 transition-opacity"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          고객센터 문의하기
        </Button>
        <p className="text-xs text-center text-muted-foreground mt-2">
          더 많은 도움이 필요하신가요? 언제든지 문의하세요!
        </p>
      </div>
    </div>
  )
}
