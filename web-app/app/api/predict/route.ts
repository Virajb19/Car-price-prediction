import { NextRequest, NextResponse } from "next/server";
import { PythonShell } from 'python-shell'

export async function POST(req: NextRequest) {
    const body = await req.json()
    const input = `${body.car_name}, ${body.year[0]}, ${body.kms_driven}, ${body.fuel}, ${body.seller_type}, ${body.transmission}, ${body.owner}`
 try{
   const msg = await new Promise((resolve, reject) => {
      const py = new PythonShell(process.cwd() + '/project.py');
      py.send(input)

      py.on('message', (message) => {
          resolve(message) 
      });

      py.on('error', (err) => {
          console.error('Python error:', err)
          reject(err)
      });

      py.end((err) => {
          if (err) {
              console.error('Python end error:', err)
              reject(err);
          }
      })
  })
   await new Promise(res => setTimeout(res,1000))
   return NextResponse.json({msg}, {status: 200})
 } catch(e) {
    console.error(e)
    return NextResponse.json({msg: 'Internal server error'}, {status: 500})
 }
}