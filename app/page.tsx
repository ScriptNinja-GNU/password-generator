'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AlertCircle, Check, Copy, RefreshCw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function PasswordGenerator() {
  const [password, setPassword] = useState('')
  const [length, setLength] = useState(12)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [strength, setStrength] = useState(0)
  const [copied, setCopied] = useState(false)

  const generatePassword = () => {
    let charset = ''
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz'
    if (includeNumbers) charset += '0123456789'
    if (includeSymbols) charset += '!@#$%^&*()_+{}[]|:;<>,.?/~'

    let newPassword = ''
    for (let i = 0; i < length; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length))
    }
    setPassword(newPassword)
  }

  useEffect(() => {
    generatePassword()
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols])

  useEffect(() => {
    let score = 0
    if (length > 12) score += 1
    if (includeUppercase) score += 1
    if (includeLowercase) score += 1
    if (includeNumbers) score += 1
    if (includeSymbols) score += 1
    setStrength(score)
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols])

  const copyToClipboard = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(password)
        .then(() => {
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        })
        .catch((err) => {
          console.error('Failed to copy text: ', err)
        })
    } else {
      console.warn('Clipboard API not available')
    }
  }

  return (
    <TooltipProvider>
      <Card className="max-w-md mx-auto mt-10 overflow-hidden">
        <CardHeader className="bg-primary text-primary-foreground">
          <CardTitle className="text-2xl font-bold">Password Ninja</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="relative">
            <Input 
              value={password} 
              readOnly 
              className="pr-20 font-mono text-lg"
            />
            <Button 
              onClick={copyToClipboard} 
              className="absolute right-1 top-1 h-8 w-8 p-0"
              variant="ghost"
            >
              <AnimatePresence>
                {copied ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Check className="h-4 w-4 text-green-500" />
                  </motion.div>
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </AnimatePresence>
            </Button>
          </div>
          <div>
            <Label htmlFor="length">Password Length: {length}</Label>
            <Slider
              id="length"
              min={8}
              max={32}
              step={1}
              value={[length]}
              onValueChange={(value) => setLength(value[0])}
              className="mt-2"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="uppercase">Include Uppercase</Label>
              <Switch
                id="uppercase"
                checked={includeUppercase}
                onCheckedChange={setIncludeUppercase}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="lowercase">Include Lowercase</Label>
              <Switch
                id="lowercase"
                checked={includeLowercase}
                onCheckedChange={setIncludeLowercase}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="numbers">Include Numbers</Label>
              <Switch
                id="numbers"
                checked={includeNumbers}
                onCheckedChange={setIncludeNumbers}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="symbols">Include Symbols</Label>
              <Switch
                id="symbols"
                checked={includeSymbols}
                onCheckedChange={setIncludeSymbols}
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span>Strength:</span>
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-6 rounded ${
                    i < strength ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            <Tooltip>
              <TooltipTrigger>
                <AlertCircle className="h-5 w-5 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Password strength is based on length and character types used.</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Button onClick={generatePassword} className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            Generate New Password
          </Button>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
