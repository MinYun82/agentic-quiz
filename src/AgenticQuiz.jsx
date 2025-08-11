import React, { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, RotateCcw, Copy, Check } from 'lucide-react'

// ---- Quiz data (scores are intentionally per-question shuffled) ----
const QUIZ = [
  {
    id: 1,
    title: 'Q1. 智慧宅初體驗',
    prompt: '你剛搬進一棟智慧宅，AI 能控制全家電器。第一天你會：',
    options: [
      { key: 'A', text: '直接用語音開關燈、開冷氣，邊喝咖啡享受科技感。', score: 2 },
      { key: 'B', text: '等室友幫我設定好，我只要會按一顆按鈕就好。', score: 1 },
      { key: 'C', text: '規劃早晚自動化情境；早上窗簾自動拉開並播放音樂。', score: 3 },
      { key: 'D', text: '研究 API，讓門鈴觸發《星際大戰》音效並同步傳訊息。', score: 4 },
    ],
  },
  {
    id: 2,
    title: 'Q2. 無限重複的任務',
    prompt: '主管交給你一份每天要輸入 500 筆資料的表格，期限一週。你會：',
    options: [
      { key: 'A', text: '戴上耳機聽歌，手動輸入到最後一筆，完成就好。', score: 1 },
      { key: 'B', text: '邊做邊試 Excel 巨集或表單公式，能省幾步是幾步。', score: 3 },
      { key: 'C', text: '立刻找現成自動化工具或外掛輔助。', score: 2 },
      { key: 'D', text: '寫腳本讓流程全自動抓取/整理/上傳，並自動通知主管。', score: 4 },
    ],
  },
  {
    id: 3,
    title: 'Q3. AI 大會上的你',
    prompt: '在年度 AI 大會上，你最想衝去聽哪一場？',
    options: [
      { key: 'A', text: '從零打造下一代自主規劃 AI 的架構與演算法。', score: 4 },
      { key: 'B', text: 'AI 改變各行各業的實際案例與啟發。', score: 2 },
      { key: 'C', text: '5 分鐘上手 ChatGPT：辦公室效率大提升。', score: 1 },
      { key: 'D', text: 'AI 代理人架構拆解：從 Prompt 到 MCP 的實作。', score: 3 },
    ],
  },
  {
    id: 4,
    title: 'Q4. 新工具問世',
    prompt: '你看到一款超強 AI 工具剛上市，第一反應是：',
    options: [
      { key: 'A', text: '先存連結，下班有空再慢慢研究。', score: 2 },
      { key: 'B', text: '立刻測試是否能與我的系統整合，打造全新工作流程。', score: 4 },
      { key: 'C', text: '先看網友試用心得，再決定要不要試。', score: 1 },
      { key: 'D', text: '試用所有功能，並記錄可能的應用場景。', score: 3 },
    ],
  },
  {
    id: 5,
    title: 'Q5. 如果你是老師',
    prompt: '你想用 AI 協助教學，會怎麼做？',
    options: [
      { key: 'A', text: '請 AI 出題與批改；我專注看成績即可。', score: 1 },
      { key: 'B', text: '與同事設計：AI 批改→補充教材→教師總結的完整流程。', score: 3 },
      { key: 'C', text: '打造能診斷學生問題並調整進度的虛擬導師。', score: 4 },
      { key: 'D', text: '用 AI 分析學習歷程，由我人工安排補救教學。', score: 2 },
    ],
  },
] as const

const RESULT_BUCKETS = [
  { range: [5, 9], title: '高效能使用者（High‑Efficiency User）', desc: '你擅長快速上手，讓工具替你省時省力。Agent 能即用即走，是你的主場。' },
  { range: [10, 15], title: '潛在建構者（Latent Creator）', desc: '你已經在思考串接與優化；再給一點指引，你能做出自己的 Agent。' },
  { range: [16, 20], title: '天生創造者（Born Creator）', desc: '你不只用工具，還會創造工具；你是產品生態系的推進者。' },
]

// Easter eggs
const EGG_MAX = {
  check: (answers) => answers.length === QUIZ.length && answers.every((s) => s === 4),
  title: '🎉 你觸發了彩蛋：超級創造神（Creator Prime）',
  desc: '你對系統化、抽象化、流程化有近乎本能的直覺。交給你，一切都能被設計成可複用的 Agent。',
}

const EGG_MIN = {
  check: (answers) => answers.length === QUIZ.length && answers.every((s) => s === 1),
  title: '🧘 彩蛋：極簡禪修者（Minimalist Mode）',
  desc: '你追求的是「少即是多」，將心智資源留給真正重要的事情。工具為你所用，而非你為工具所累。',
}

export default function AgenticQuiz() {
  const [step, setStep] = useState(0) // 0..QUIZ.length
  const [answers, setAnswers] = useState([])
  const [copied, setCopied] = useState(false)

  const current = QUIZ[step]
  const total = useMemo(() => answers.reduce((a, b) => a + b, 0), [answers])

  const bucket = useMemo(() => {
    for (const b of RESULT_BUCKETS) {
      if (total >= b.range[0] && total <= b.range[1]) return b
    }
    return null
  }, [total])

  const egg = useMemo(() => {
    if (EGG_MAX.check(answers)) return EGG_MAX
    if (EGG_MIN.check(answers)) return EGG_MIN
    return null
  }, [answers])

  const progress = Math.round((answers.length / QUIZ.length) * 100)

  const onChoose = (score) => {
    const next = [...answers, score]
    setAnswers(next)
    setStep(step + 1)
  }

  const reset = () => {
    setAnswers([])
    setStep(0)
    setCopied(false)
  }

  const shareText = useMemo(() => {
    const title = (egg && egg.title) || (bucket && bucket.title) || 'Agentic 心智類型測驗'
    const line1 = `我的測驗結果：${title}`
    const line2 = `總分 ${total} 分／20 分`
    const line3 = `來測測你是 Agentic User 還是 Creator！`
    return [line1, line2, line3].join('\n')
  }, [bucket, egg, total])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareText)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {}
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <header className="flex items-center gap-3 mb-6">
          <Sparkles className="w-6 h-6" />
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            你是 <span className="text-indigo-600">Agentic User</span> 還是 <span className="text-indigo-600">Creator</span>？
          </h1>
        </header>

        {/* Progress */}
        <div className="mb-6">
          <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-indigo-600"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            />
          </div>
          <div className="text-sm text-slate-600 mt-2">進度 {answers.length}/{QUIZ.length}</div>
        </div>

        {/* Quiz or Result */}
        <AnimatePresence mode="wait">
          {step < QUIZ.length ? (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="border border-slate-200 rounded-2xl shadow-sm bg-white">
                <div className="p-6">
                  <div className="mb-4">
                    <div className="text-sm font-medium text-slate-500">{current.title}</div>
                    <h2 className="text-xl font-semibold mt-1">{current.prompt}</h2>
                  </div>

                  <div className="grid gap-3">
                    {current.options.map((opt) => (
                      <motion.button
                        key={opt.key}
                        onClick={() => onChoose(opt.score)}
                        className="text-left rounded-2xl border border-slate-200 px-4 py-3 hover:border-indigo-400 hover:bg-indigo-50/40 focus:outline-none"
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 text-slate-500 font-semibold w-6">{opt.key}.</div>
                          <div className="flex-1">
                            <div className="font-medium">{opt.text}</div>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="border border-slate-200 rounded-2xl shadow-sm bg-white">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-slate-500">測驗完成</div>
                      <h2 className="text-2xl font-bold mt-1">總分 {total} / 20</h2>
                    </div>
                    <button onClick={reset} className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900">
                      <RotateCcw className="w-4 h-4" /> 重新測驗
                    </button>
                  </div>

                  {/* Egg or Bucket */}
                  <div className="mt-6">
                    {egg ? (
                      <div className="rounded-2xl border border-indigo-300 bg-indigo-50 p-4">
                        <div className="text-lg font-semibold">{egg.title}</div>
                        <p className="text-slate-700 mt-1">{egg.desc}</p>
                        <div className="mt-3 text-sm text-indigo-700">（小提示：這是隱藏彩蛋，只會在特定選項組合出現）</div>
                      </div>
                    ) : bucket ? (
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="text-lg font-semibold">{bucket.title}</div>
                        <p className="text-slate-700 mt-1">{bucket.desc}</p>
                      </div>
                    ) : null}
                  </div>

                  {/* Answers recap */}
                  <div className="mt-6">
                    <div className="text-sm font-medium text-slate-600 mb-2">你的選擇</div>
                    <ul className="grid gap-2">
                      {QUIZ.map((q, i) => (
                        <li key={q.id} className="text-sm text-slate-700">
                          <span className="font-semibold mr-2">Q{i + 1}</span>
                          <span>得分 {answers[i]}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Share */}
                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <button onClick={copy} className="inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700">
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? '已複製！' : '複製結果文字'}
                    </button>
                    <button onClick={reset} className="rounded-xl px-4 py-2 border border-slate-300 hover:bg-slate-50">再玩一次</button>
                  </div>
                </div>
              </div>

              {/* Subtle confetti-like emoji when egg max */}
              <AnimatePresence>
                {EGG_MAX.check(answers) && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mt-6 grid grid-cols-6 gap-2 text-center text-2xl"
                  >
                    {'🎊🎉✨🚀🧠🛠️'.split('').map((e, i) => (
                      <motion.div key={i} initial={{ y: -8 }} animate={{ y: 0 }} transition={{ delay: i * 0.05 }}>
                        {e}
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="mt-10 text-center text-xs text-slate-500">
          <div>Agentic 心智類型測驗 • v1.1（含彩蛋）</div>
          <div className="mt-1">提示：每題的分數配置皆不同，別想用排除法破解 😉</div>
        </footer>
      </div>
    </div>
  )
}
