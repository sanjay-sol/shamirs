"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


function Searchbar() {
  const router = useRouter();
  const [search, setSearch] = useState("");


  return (
    <div className='searchbar'>
      <Image
        src='/assets/search-gray.svg'
        alt='search'
        width={24}
        height={24}
        className='object-contain'
      />
      <input
        id='text'
        value={search}
        className='no-focus searchbar_input'
      />
    </div>
  );
}

export default Searchbar;
