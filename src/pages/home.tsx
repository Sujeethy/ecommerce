import React, { useState, useEffect } from 'react';
import { api } from "~/utils/api";
import { useRouter } from 'next/router'; 
import Nav from "~/pages/components/Nb";
import CheckedIcon from "~/pages/svg/checked";
import UncheckedIcon from "~/pages/svg/unchecked";

interface Category {
  id: number;
  name: string;
  isChecked: boolean;
}

export default () => {
  const [items, setItems] = useState<Category[]>([]); // Initialize items as an empty array of Category
  const router = useRouter();
  const pageParam: string = router.query.page?.toString() === 'undefined' ? '1' : router.query.page?.toString() ?? '1';

  const initialPage = pageParam ? parseInt(Array.isArray(pageParam) ? pageParam[0] : pageParam, 10) : 1;

  const [currentPage, setCurrentPage] = useState(initialPage);

  const pageSize = 6; 
  const maxPagesToShow = 7; 

  const getcategories = api.post.getcategories.useMutation();
  const addCategory = api.post.addCategory.useMutation();
  const removeCategory = api.post.removeCategory.useMutation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUserDataString = window.localStorage.getItem('User');
        if (storedUserDataString) {
          const storedUserData = JSON.parse(storedUserDataString);
          const userId = storedUserData.id;
          
          const data = await getcategories.mutateAsync({ userId, page: currentPage }) as { categories: Category[] };
          if (data && Array.isArray(data.categories)) {
            setItems(data.categories);
          } else {
            console.error('Error: Data does not contain categories or is not in the expected format');
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [currentPage]); // Include 'getcategories' in the dependency array

  const handleToggle = (index: number, id: number) => {
    setItems(prevItems => {
      const updatedItems = [...prevItems];
      const categoryId = id;
      updatedItems[index] = {
        ...updatedItems[index],
        id: categoryId, // Ensure id is always defined
        name: updatedItems[index]?.name ?? '', // Ensure name is always defined
        isChecked: !updatedItems[index]?.isChecked
      };
      if (!updatedItems[index]?.isChecked) {
        removeCategory.mutateAsync({ userId: getUserId(), categoryId });
      } else {
        addCategory.mutateAsync({ userId: getUserId(), categoryId });
      }
      return updatedItems;
    });
  };
  
  const getUserId = () => {
    if (typeof window !== "undefined") {
      const storedUserDataString = window.localStorage.getItem('User');
      if (storedUserDataString) {
        const storedUserData = JSON.parse(storedUserDataString);
        return storedUserData.id;
      }
    }
    return 0;
  };

  const totalPages = Math.ceil(100 / pageSize);

  const handlePageChange = (newPage:number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      router.push({ pathname: '/home', query: { page: newPage } }); 
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let start = 1;
      let end = totalPages;
      const halfMaxPagesToShow = Math.floor(maxPagesToShow / 2);
      if (currentPage > halfMaxPagesToShow + 1) {
        start = currentPage - halfMaxPagesToShow;
        end = Math.min(totalPages, currentPage + halfMaxPagesToShow);
      } else {
        end = maxPagesToShow;
      }
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
      if (end < totalPages) {
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    return pageNumbers;
  };
  return (
    <div>
      <Nav />
      <div className="flex justify-center pt-10">
        <div className="w-[576px] h-[691px] border-2 border-gray-300 rounded-lg flex flex-col items-center  flex-wrap content-around">
          <div className="pt-10 font-inter text-3xl font-semibold leading-9 text-left">Please mark your interests!</div>
          <div className="pt-6 text-base">We will keep you notified.</div>
          <div className="text-xl font-semibold pt-9 w-[456px] flex flex-col gap-y-6 justify-center">
            <div>My saved interests!</div>
            {items.map((item, index) => (
              <div key={item.id} className="h-6 flex flex-row content-center" onClick={() => handleToggle(index, item.id)}>
                {item.isChecked? <CheckedIcon /> : <UncheckedIcon />}
                <span className="text-base pl-3">{item.name}</span>
              </div>
            ))}
          </div>
          <div className="pt-16 w-[456px] flex  gap-x-2" >
            <button onClick={() => handlePageChange(1)}>{"<<"}</button>
            <button onClick={() => handlePageChange(currentPage - 1)}>{"<"}</button>
            {getPageNumbers().map((page, index) => (
              page===currentPage?<button key={index} className="text-black text-xl" onClick={() => handlePageChange(typeof page === 'string' ? parseInt(page, 10) : page)}>{page}</button>:
              <button key={index} className="text-[#ACACAC] text-xl" onClick={() => handlePageChange(typeof page === 'string' ? parseInt(page, 10) : page)}>{page}</button>
            ))}
            <button onClick={() => handlePageChange(currentPage + 1)}>{">"}</button>
            <button onClick={() => handlePageChange(totalPages)}>{">>"}</button>
          </div>
        </div>
      </div>
    </div>
  )};