"use client"

import React, { useState , useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Clipboard, Link, Twitter, Youtube, Activity, Video, Image, Trash2 } from 'lucide-react'
import { QrCode } from 'lucide-react'
import CopyButton from '@/components/CopyButton'
import { StatusChangeDialog } from '@/components/StatusChangeDialog'
import Navbar from '@/components/Navbar'
import ShortUrlQRCode from '@/components/ShortUrlQRCode'
import { Notification } from '@/components/Notification'
import SkeletonRow from '@/components/SkeletonRow'

export default function Component() {

  useEffect(() => {
    // Fetch the initial list of URLs when the component mounts
    fetchUrls()
  }, [])


  useEffect(() => {
    // Simulate data fetching
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])



  const truncateUrl = (url, maxLength) => {
    return url.length > maxLength ? url.substring(0, maxLength) + '...' : url
  }

  const [url, setUrl] = useState("")
  const [urls, setUrls] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedLink, setSelectedLink] = useState(null)

  const [notificationVisible, setNotificationVisible] = useState(false);


  /** this fetches all the urls */

  async function fetchUrls() {
    const response = await fetch("/api/shortener")
    if (response.ok) {
      const data = await response.json()
      setUrls(data)
    }
  }

  async function submitUrl() {
    const response = await fetch("/api/shortener", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ original_url: url })
    })

    if (response.ok) {
      // Trigger GET request to fetch the updated list of URLs
      setUrl("")
      fetchUrls()
    }
  }

  const handleStatusClick = (link) => {
    setSelectedLink(link)
    setDialogOpen(true)
  }

  const handleConfirmStatusChange = async () => {
    try {
      const response = await fetch('/api/shortener', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedLink.id,
          status: selectedLink.status === 'active' ? 'inactive' : 'active'
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update status');
      }
  
      const data = await response.json();
  
      setUrls(urls.map(link => 
        link.id === selectedLink.id ? data.updatedUrl : link
      ));
  
      setDialogOpen(false);
    } catch (error) {
      console.error('Error updating status:', error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/shortener?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete URL');
      }

      setUrls(urls.filter(url => url.id !== id));
    } catch (error) {
      console.error('Error deleting URL:', error);
      // Handle error (e.g., show an error message to the user)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-indigo-950  text-white p-6">
      <Navbar/>

        <main className="md:max-w-3xl lg:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-4">
        <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">Shorten Your Loooong </span>Links :)
        </h2>
        <p className="text-center text-gray-400 mb-6 sm:mb-8 text-sm sm:text-base">
          Trimlink is an efficient and easy-to-use URL shortening service that streamlines your online experience.
        </p>

        <div className="flex flex-col sm:flex-row mb-6 sm:mb-8">
          <div className="flex-grow bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border border-white border-opacity-20 rounded-t-lg sm:rounded-l-full sm:rounded-tr-none flex items-center px-3 py-2 sm:px-4">
            <Link className="text-gray-300 mr-2" />
            <input 
              className="bg-transparent border-none outline-none py-4 sm:py-0 text-white w-full text-sm sm:text-base placeholder-gray-300"
              placeholder="Enter the link here"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <Button onClick={submitUrl} className="bg-blue-600 hover:bg-blue-700 md:p-6 rounded-t-none rounded-b-lg sm:rounded-l-none sm:rounded-r-full">
            Shorten Now!
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-400 mb-6 sm:mb-8 space-y-2 sm:space-y-0">
          <div className="flex items-center gap-2">
            <label htmlFor="auto-paste">Automatically generate <span>QR </span> codes for your links!</label>
          </div>
          <div>Organize and manage all your links in one convenient dashboard</div>
        </div>

        
       
        <div className="hidden lg:block overflow-x-auto">
        <Table className="rounded-lg bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border border-white border-opacity-20">
          <TableHeader>
            <TableRow className="border-b border-white border-opacity-10">
              <TableHead className="text-gray-400">Short Link</TableHead>
              <TableHead className="text-gray-400">Original Link</TableHead>
              <TableHead className="text-gray-400">QR Code</TableHead>
              <TableHead className="text-gray-400">Clicks</TableHead>
              <TableHead className="text-gray-400">Status</TableHead>
              <TableHead className="text-gray-400">Date</TableHead>
              
            </TableRow>
          </TableHeader>
          <TableBody>

            {/** given below is a dummy data  icon will be later fetched by meta data, the short url will be created, clicks will be counted*/}
            {isLoading ? (
          <>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </>
        ) : (urls.map((row, index) => (
              <TableRow className="hover:bg-white hover:bg-opacity-5 transition-colors" key={index}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-5">
                  {/** the clipboard button will copy  the shortened url <Clipboard className="text-gray-400 cursor-pointer" size={32} /> */}
                  <div onClick={() => setNotificationVisible(true)}>
                  <CopyButton text={row.shortUrl} />
                  </div>
                  <span>{row.shortUrl}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span title={row.originalUrl} className="max-w-[200px] truncate">
                      {truncateUrl(row.originalUrl, 25)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                    <ShortUrlQRCode url={row.shortUrl} />
                </TableCell>
                <TableCell className="text-center">{row.clicks}</TableCell>
                <TableCell>
                <Button
                    onClick={() => handleStatusClick(row)}
                    className={`px-3 py-1 text-sm ${
                      row.status === 'active'
                        ? 'bg-green-900 text-green-300 hover:bg-green-800'
                        : 'bg-yellow-900 text-yellow-300 hover:bg-yellow-800'
                    }`}
                  >
                    {row.status}
                  </Button>
                </TableCell>
                <TableCell>{row.createdAt}</TableCell>
                <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(row.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </TableCell>
              </TableRow>)
            ))}
          </TableBody>
        </Table>
        </div>

        <div className="lg:hidden space-y-4 max-w-3xl mx-auto">
          {urls.map((row) => (
            <div key={row.id} className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border border-white border-opacity-20 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm md:text-lg">{row.shortUrl}</span>
                  <CopyButton text={row.shortUrl} />
                </div>
                <ShortUrlQRCode url={row.shortUrl} />
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span title={row.originalUrl} className="truncate max-w-[200px] sm:max-w-[300px]">
                  {truncateUrl(row.originalUrl, 30)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>{row.clicks} clicks</span>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => handleStatusClick(row)}
                    className={`px-3 py-1 text-xs md:text-sm ${
                      row.status === 'active'
                        ? 'bg-green-900 text-green-300 hover:bg-green-800'
                        : 'bg-yellow-900 text-yellow-300 hover:bg-yellow-800'
                    }`}
                  >
                    {row.status}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(row.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
              <div className="text-xs text-gray-400">{row.createdAt}</div>
            </div>
          ))}
        </div>



      </main>

      <StatusChangeDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onConfirm={handleConfirmStatusChange}
        currentStatus={selectedLink?.status}
      />
      
      <Notification 
        message="Link copied to clipboard!"
        isVisible={notificationVisible}
        onClose={() => setNotificationVisible(false)}
      />

    </div>
  )
}