import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectMongoDB from "@/lib/databse/mongodb";
import Product from "@/lib/models/Product";
import { getAuthenticatedUser, isCustomer } from "@/lib/auth";
export const dynamic = "force-dynamic";
async function customer(request) { const user=await getAuthenticatedUser(request); if(!user) return {response:NextResponse.json({message:"Authentication required"},{status:401})}; if(!isCustomer(user)) return {response:NextResponse.json({message:"Customer account required"},{status:403})}; return {user}; }
export async function GET(request) { const access=await customer(request); if(access.response)return access.response; await connectMongoDB(); const products=await Product.find({_id:{$in:access.user.wishlist||[]},isActive:true}).populate("category","categoryName").lean(); return NextResponse.json({success:true,products:products.map(p=>({id:p._id.toString(),name:p.productName,sku:p.productSKU,category:p.category?.categoryName||"",price:p.price,discount:p.discount||0,image:p.image?.url||"",inStock:p.currentStock>0}))}); }
export async function POST(request) { const access=await customer(request); if(access.response)return access.response; try {const {productId}=await request.json();if(!mongoose.isValidObjectId(productId))return NextResponse.json({message:"Invalid product id"},{status:400});await connectMongoDB();if(!await Product.exists({_id:productId,isActive:true}))return NextResponse.json({message:"Product not found"},{status:404});await access.user.updateOne({$addToSet:{wishlist:new mongoose.Types.ObjectId(productId)}});return NextResponse.json({success:true});}catch(e){console.error("Wishlist add error",e);return NextResponse.json({message:"Unable to update wishlist"},{status:500});} }
