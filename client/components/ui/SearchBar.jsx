"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { debounce } from "@/utils/helpers"

export default function SearchBar({ onSearch, placeholder = "Search...", initialValue = "" }) {
  const [searchTerm, setSearchTerm] = useState(initialValue)

  // Create a debounced search function
  const debouncedSearch = debounce((value) => {
    onSearch(value)
  }, 500)

  useEffect(() => {
    setSearchTerm(initialValue)
  }, [initialValue])

  const handleChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    debouncedSearch(value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(searchTerm)
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder={placeholder}
        />
      </div>
    </form>
  )
}
