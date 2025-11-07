"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Mail, Phone, Instagram, Send, Upload, X, Lightbulb, Check, Paperclip } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { sendEmail } from "@/actions/sendEmail" // Убедитесь, что путь к вашему серверному действию верный
import Link from "next/link"
import Image from "next/image"

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [formStatus, setFormStatus] = useState<{ message: string; type: "success" | "error" | "" }>({
    message: "",
    type: "",
  })
  const [copied, setCopied] = useState<string>("")

  // Создаем временные URL для превью изображений
  const filePreviews = files.map(file => ({
    name: file.name,
    type: file.type,
    size: file.size,
    url: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
  }))

  // Очищаем временные URL при размонтировании компонента, чтобы избежать утечек памяти
  useEffect(() => {
    return () => {
      filePreviews.forEach(preview => {
        if (preview.url) {
          URL.revokeObjectURL(preview.url)
        }
      })
    }
  }, [files]) // Зависимость от files, чтобы эффект срабатывал при их изменении

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopied(type)
        setTimeout(() => setCopied(""), 2000) // Сбросить состояние через 2 секунды
      },
      (err) => {
        console.error("Не удалось скопировать текст: ", err)
        setFormStatus({ message: "Ошибка при копировании. Попробуйте еще раз.", type: "error" })
      },
    )
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Добавляем новые выбранные файлы к уже существующим в состоянии
      setFiles(prevFiles => [...prevFiles, ...Array.from(e.target.files!)])
    }
  }

  const removeFile = (indexToRemove: number) => {
    setFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove))
    // Сбрасываем значение инпута, чтобы можно было выбрать тот же файл снова
    const fileInput = document.getElementById("files") as HTMLInputElement
    if (fileInput) fileInput.value = ""
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setFormStatus({ message: "", type: "" })

    const formData = new FormData(event.currentTarget)
    // Очищаем ключ 'files' и добавляем все файлы из нашего состояния
    formData.delete('files')
    files.forEach(file => {
      formData.append('files', file)
    })

    const result = await sendEmail(formData)

    if (result.success) {
      setFormStatus({ message: result.message, type: "success" })
      ;(event.target as HTMLFormElement).reset() // Очищаем поля формы
      setFiles([]) // Очищаем массив файлов
    } else {
      setFormStatus({ message: result.message || "Произошла неизвестная ошибка.", type: "error" })
    }

    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <Lightbulb className="w-8 h-8 text-[#C17B5C]" />
            <h1 className="text-4xl md:text-5xl font-bold text-[#2C1810] font-serif">Свяжитесь с нами</h1>
          </div>
          <p className="text-lg text-[#6B5A4C] max-w-2xl mx-auto font-sans">
            Расскажите нам о светильнике вашей мечты, и мы поможем воплотить её в реальность
          </p>
        </motion.div>

        {/* Contact Buttons */}
        <motion.div
          className="flex flex-col md:flex-row justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <button
            onClick={() => copyToClipboard("3dfabriq@mail.ru", "Email")}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-[#C17B5C] text-[#C17B5C] hover:bg-[#C17B5C] hover:text-white transition-all duration-300 rounded-lg font-medium font-sans"
          >
            {copied === "Email" ? <Check size={18} /> : <Mail size={18} />}
            <span className="text-sm md:text-base">{copied === "Email" ? "Скопировано!" : "3dfabriq@mail.ru"}</span>
          </button>

          <button
            onClick={() => copyToClipboard("+375 (99) 123-45-67", "Телефон")}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-[#C17B5C] text-[#C17B5C] hover:bg-[#C17B5C] hover:text-white transition-all duration-300 rounded-lg font-medium font-sans"
          >
            {copied === "Телефон" ? <Check size={18} /> : <Phone size={18} />}
            <span className="text-sm md:text-base">{copied === "Телефон" ? "Скопировано!" : "+375 (99) 123-45-67"}</span>
          </button>

          <Link
            href="https://www.instagram.com"
            target="_blank"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-[#C17B5C] text-[#C17B5C] hover:bg-[#C17B5C] hover:text-white transition-all duration-300 rounded-lg font-medium font-sans"
          >
            <Instagram size={18} />
            <span className="text-sm md:text-base">Instagram</span>
          </Link>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-8 md:p-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#2C1810] mb-2 font-sans">
                Ваше имя *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-4 py-3 border-2 border-[#E8DED0] rounded-lg focus:outline-none focus:border-[#C17B5C] transition-colors text-[#2C1810] bg-[#FAF7F2] font-sans"
                placeholder="Иван Иванов"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#2C1810] mb-2 font-sans">
                Ваш email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-4 py-3 border-2 border-[#E8DED0] rounded-lg focus:outline-none focus:border-[#C17B5C] transition-colors text-[#2C1810] bg-[#FAF7F2] font-sans"
                placeholder="ivan@example.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-[#2C1810] mb-2 font-sans">
                Телефон
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="w-full px-4 py-3 border-2 border-[#E8DED0] rounded-lg focus:outline-none focus:border-[#C17B5C] transition-colors text-[#2C1810] bg-[#FAF7F2] font-sans"
                placeholder="+375 (99) 123-45-67"
              />
            </div>

            {/* Lamp Description */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-[#2C1810] mb-2 font-sans">
                Описание желаемого светильника *
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={6}
                className="w-full px-4 py-3 border-2 border-[#E8DED0] rounded-lg focus:outline-none focus:border-[#C17B5C] transition-colors text-[#2C1810] bg-[#FAF7F2] resize-none font-sans"
                placeholder="Расскажите о стиле, размере, цвете и других характеристиках светильника, который вы ищете..."
              />
            </div>

            {/* File Upload */}
            <div>
              <label htmlFor="files" className="block text-sm font-medium text-[#2C1810] mb-2 font-sans">
                Файлы (опционально)
              </label>
              <div className="relative">
                <input
                  type="file"
                  id="files"
                  name="files"
                  multiple // Разрешаем выбор нескольких файлов
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="files"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-[#E8DED0] rounded-lg cursor-pointer hover:border-[#C17B5C] transition-colors bg-[#FAF7F2]"
                >
                  <Upload size={20} className="text-[#C17B5C]" />
                  <span className="text-[#6B5A4C] font-sans">
                    {files.length > 0 ? `Выбрано файлов: ${files.length}` : "Загрузите фото или другие файлы"}
                  </span>
                </label>
              </div>

              {/* Files Preview */}
              {files.length > 0 && (
                <div className="mt-4 space-y-3">
                  <AnimatePresence>
                    {filePreviews.map((preview, index) => (
                      <motion.div
                        key={preview.name + index}
                        layout
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="relative p-2 border-2 border-[#E8DED0] rounded-lg bg-[#FAF7F2]"
                      >
                        <div className="flex items-center">
                          {preview.url ? (
                            <div className="relative w-16 h-16 rounded-md overflow-hidden mr-4 flex-shrink-0">
                              <Image src={preview.url} alt={preview.name} fill className="object-cover" />
                            </div>
                          ) : (
                            <div className="w-16 h-16 flex items-center justify-center bg-[#E8DED0] rounded-md mr-4 flex-shrink-0">
                              <Paperclip className="w-6 h-6 text-[#C17B5C]" />
                            </div>
                          )}
                          <div className="flex-grow min-w-0">
                            <p className="text-sm font-medium text-[#2C1810] truncate">{preview.name}</p>
                            <p className="text-xs text-[#6B5A4C]">{Math.round(preview.size / 1024)} KB</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="ml-4 p-2 rounded-full hover:bg-red-100 transition-colors flex-shrink-0"
                          >
                            <X size={18} className="text-red-500" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#C17B5C] text-white hover:bg-[#A66A4D] disabled:bg-[#C17B5C]/50 disabled:cursor-not-allowed transition-all duration-300 rounded-lg font-semibold text-lg font-sans"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Отправка...</span>
                </>
              ) : (
                <>
                  <span>Отправить запрос</span>
                  <Send size={20} />
                </>
              )}
            </button>

            {/* Form Status Message */}
            <AnimatePresence>
              {formStatus.message && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`text-center font-medium font-sans ${
                    formStatus.type === "success" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {formStatus.message}
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-[#6B5A4C] font-sans">Мы ответим на ваш запрос в течение 24 часов</p>
        </motion.div>
      </div>
    </div>
  )
}