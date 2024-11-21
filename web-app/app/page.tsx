'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useForm } from "react-hook-form"
import { motion } from 'framer-motion'
import { cars } from '../car'
import { Slider } from "@/components/ui/slider"
import axios from 'axios';
import { useState } from "react"
import { twMerge } from "tailwind-merge"
import { Loader2 } from 'lucide-react'
import { toast } from "sonner"


export default function page() {
  const form = useForm({
    defaultValues: {
      kms_driven: "",
      year: 1991,
      car_name: "",
      fuel: "",
      seller_type: "",
      transmission: "",
      owner: "",
    }
  })

  const [price,setPrice] = useState<number | null>(null)
  const [loading,setLoading] = useState(false)

  async function onSubmit(data: any) {
    try{
    setLoading(true)
    const res = await axios.post('/api/predict', data)
    setPrice(Math.floor(res.data.msg))
  } catch(e) {
    toast.error('Something went wrong!!!. Try again')
  } finally {
      setLoading(false)
    }
    setTimeout(() => {
      setPrice(null)
    },8000)
  }

  if(price) return <main className="w-full min-h-screen bg-black flex-center">
             <Card>
              <CardHeader>
                <CardTitle className="text-4xl">Predicted Price</CardTitle>
              </CardHeader>
              <CardContent>
                 <span className="text-2xl">₹{price}</span>
              </CardContent>
             </Card>
  </main>

  return (
    <main className="w-full min-h-screen bg-black flex flex-col gap-5 justify-center items-center">
      <Card className="relative">
        <CardHeader>
          <CardTitle className="text-5xl">Car Price Prediction</CardTitle>
        </CardHeader>
        <CardContent className="w-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-1">
              
            <FormField
  control={form.control}
  name="kms_driven"
  render={({ field }) => (
    <FormItem>
      <FormLabel>KM driven</FormLabel>
      <FormControl>
        <input className="w-full outline-none px-4 py-2 border-2 border-zinc-700 bg-transparent text-sm text-white rounded-xl focus:ring-2 focus:ring-offset-0 focus:ring-red-800 focus:border-none duration-300" placeholder="enter the kms driven" {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

<FormField
            control={form.control}
            name="year"
            render={({ field: { value, onChange } }) => (
              <FormItem>
                <FormLabel>Year - {value}</FormLabel>
                <FormControl>
                  <Slider
                    min={1990}
                    max={2024}
                    step={1}
                    defaultValue={[value]}
                    onValueChange={onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
              
              <FormField
                control={form.control}
                name="car_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-2xl">Car name</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a car company and model" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {cars.slice(0,500).map((car, i) => (
                          <SelectItem key={i} value={car}>{car}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fuel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-2xl">Fuel</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a fuel type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {['Petrol', 'Diesel', 'CNG', 'LPG', 'Electric'].map((fuel, i) => (
                          <SelectItem key={i} value={fuel}>{fuel}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Seller Type Select */}
              <FormField
                control={form.control}
                name="seller_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-2xl">Seller Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select seller type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {['Dealer','Individual','Trustmark Dealer'].map((seller, i) => (
                          <SelectItem key={i} value={seller}>{seller}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Transmission Select */}
              <FormField
                control={form.control}
                name="transmission"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-2xl">Transmission</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select transmission type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {['Manual', 'Automatic'].map((transmission, i) => (
                          <SelectItem key={i} value={transmission}>{transmission}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Owner Select */}
              <FormField
                control={form.control}
                name="owner"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-2xl">Owner</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select number of owners" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {['First Owner','Second Owner','Third Owner', 'Fourth & Above Owner', 'Test Drive Car'].map((owner, i) => (
                          <SelectItem key={i} value={owner}>{owner}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <motion.button 
                type="submit"
                whileHover={loading ? {} : {scale: 1.05}} whileTap={loading ? {} : {scale: 0.9}}
                className={twMerge("bg-rose-700 px-4 py-2 rounded-full font-semibold text-white mx-auto flex gap-2", loading && "cursor-not-allowed opacity-50")}
              >
                {loading && <Loader2 className="animate-spin"/>} {loading ? 'Please wait' : 'Predict'}
              </motion.button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  )
}
