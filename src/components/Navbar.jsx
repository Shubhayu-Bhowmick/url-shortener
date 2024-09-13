import React from 'react'
import { Button } from './ui/button'
import { Menu } from 'lucide-react'

const Navbar = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="flex justify-between items-center py-6">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-pink-500">Trimlink<sup className="text-xs">*</sup></h1>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="text-gray-400 hidden sm:inline-flex">Login</Button>
            <Button className="bg-blue-600 hover:bg-blue-700 hidden sm:inline-flex">Register Now</Button>
            <Button variant="ghost" size="icon" className="sm:hidden">
              <Menu className="h-6 w-6 text-gray-400" />
            </Button>
          </div>
        </header>
      </div>
  )
}

export default Navbar
