"use client";
import React from "react";
import Navbar from "@/components/navbar";
import Link from "next/link";
import supabase from "@/lib/supabaseClient";
import { toPublicUrl } from "@/lib/storage";

export default function ProductViewPage() {
    return (
        <div>
            <Navbar />
            <h1>Product View</h1>
        </div>
    );
}