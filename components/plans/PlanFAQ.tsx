"use client";

import { useState } from "react";


const questions = [

  {
    q: "What is the Free Plan?",
    a: "The Free Plan allows new members to experience Imperial Aurum mining without an initial deposit. Members receive daily mining rewards and can upgrade anytime.",
  },


  {
    q: "How does Premium Mining work?",
    a: "Premium plans provide higher mining power, increased daily rewards, priority features, and additional earning opportunities.",
  },


  {
    q: "What is the Shared Plan?",
    a: "The Shared Plan allows members to grow together through team building, referral rewards, leadership bonuses, and community mining growth.",
  },


  {
    q: "How many referral levels are available?",
    a: "Imperial Aurum provides a 20-level referral structure where members can earn through their growing network.",
  },


  {
    q: "Can I upgrade my plan later?",
    a: "Yes. Members can upgrade from Free to Premium or participate in Shared Plans as their goals grow.",
  },


  {
    q: "Are withdrawals available?",
    a: "Withdrawals are available according to your account status, verification, and platform policies.",
  },

];


export default function PlanFAQ(){


const [open,setOpen] = useState<number | null>(null);



return (

<section className="py-28 bg-black">


<div className="max-w-5xl mx-auto px-6">


<div className="text-center mb-16">


<span className="text-yellow-400 uppercase tracking-[5px]">
FAQ
</span>


<h2 className="text-5xl font-bold mt-5">
Investment Plan Questions
</h2>


</div>



<div className="space-y-5">


{questions.map((item,index)=>(


<div
key={index}
className="bg-zinc-900 border border-yellow-500/20 rounded-3xl overflow-hidden"
>


<button

onClick={()=>setOpen(
open === index ? null : index
)}

className="w-full p-7 flex justify-between text-left font-semibold text-xl"

>


{item.q}


<span className="text-yellow-400">
{open === index ? "-" : "+"}
</span>


</button>




{open === index && (

<div className="px-7 pb-7 text-zinc-300 leading-8">

{item.a}

</div>

)}


</div>


))}


</div>


</div>


</section>

);

}