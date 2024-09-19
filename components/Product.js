import { useState } from "react";
import axios from "axios";
import React from "react";
import { useRouter } from "next/router";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";

export default function Product() {
  const [redirect, setRedirect] = useState(false);
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [price, setPrice] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const uploadImagesQueue = [];

  async function createProduct(ev) {
    ev.preventDefault();

    if (isUploading) {
      // Wait for the images to finish uploading
      await Promise.all(uploadImagesQueue);
    }

    const data = { title, description, price, images };
    await axios.post("/api/products", data);

    setRedirect(true);
  }
  async function uploadImage(ev) {
    const files = ev.target?.files;
    if (files?.length > 0) {
      for (const file of files) {
        const data = new FormData();
        data.append("file", file);

        uploadImagesQueue.push(
          axios.post("/api/upload", data).then((res) => {
            setImages((oldImages) => [...oldImages, ...res.data.links]);
          })
        );
      }
      await Promise.all(uploadImagesQueue);

      setIsUploading(false);
    } else {
      return "An Error Occurred";
    }
  }

  if (redirect) {
    router.push("/products");
    return null;
  }

  function updateImagesOrder(images) {
    setImages(images);
    console.log(images);
  }

  function handleDeleteImage(index) {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
  }

  return (
    <>
      <form onSubmit={createProduct} className=" mx-auto my-3 max-w-screen-sm">
        <div className=" mx-auto my-3">
          <div>
            <label
              for="example1"
              class="mb-1 block text-lg font-medium text-gray-700 py-1"
            >
              Product title
            </label>
            <input
              type="text"
              id="example1"
              class="block w-full rounded-md border border-gray-300 shadow-sm 
              focus:border-primary-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50 disabled:cursor-not-allowed
               disabled:bg-gray-50 disabled:text-gray-500 p-3"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Product title"
            />
          </div>
        </div>
        <div className=" mx-auto my-3">
          <div>
            <label
              for="example1"
              class="mb-1 block text-lg font-medium text-gray-700 py-1"
            >
              Select category{" "}
            </label>
            <select
              type="text"
              id="example1"
              class="block w-full rounded-md border border-gray-300 shadow-sm 
              focus:border-primary-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50 disabled:cursor-not-allowed
               disabled:bg-gray-50 disabled:text-gray-500 p-3"
              placeholder="Product title"
            >
              <option value="">No category selected</option>
              <option value="">Option 1</option>
              <option value="">Option 2</option>
            </select>
          </div>
        </div>
        <div className=" mx-auto my-3">
          <div className="mx-auto">
            <label
              for="example1"
              class="mb-1 block text-lg font-medium text-gray-700 py-1"
            >
              Images
            </label>
            <label class="flex w-full cursor-pointer appearance-none items-center justify-center rounded-md border-2 border-dashed border-gray-200 p-6 transition-all hover:border-primary-300">
              <div class="space-y-1 text-center">
                <div class="mx-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="h-6 w-6 text-gray-500"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                    />
                  </svg>
                </div>
                <div class="text-gray-600">
                  <a
                    href="#"
                    class="font-medium text-primary-500 hover:text-primary-700"
                  >
                    Click to upload
                  </a>{" "}
                  or drag and drop
                </div>
                <p class="text-sm text-gray-500">
                  SVG, PNG, JPG or GIF (max. 800x400px)
                </p>
              </div>
              <input
                id="fileInput"
                type="file"
                className="hidden"
                accept="image/*"
                multiple
                onChange={uploadImage}
              />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-2 items-center rounded">
          {isUploading && (
            <Spinner className="p-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          )}
        </div>
        {!isUploading && (
          <div className=" grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-2">
            <ReactSortable
              list={images}
              setList={updateImagesOrder}
              className="w-[350px] h-auto  gap-2 flex  justify-between align-items-center"
            >
              {images.map((link, index) => (
                <div key={link} className="relative group">
                  <img
                    src={link}
                    alt="image"
                    className="object-cover h-32 w-44 rounded-md border p-2 cursor-pointer transition-transform transform-gpu group-hover:scale-105"
                  />
                  <div className="absolute top-2 right-2 cursor-pointer opacity-0 group-hover:opacity-100">
                    <button onClick={() => handleDeleteImage(index)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        className="w-6 h-6 text-red-600 bg-white rounded-full"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </ReactSortable>
          </div>
        )}

        <div className=" mx-auto my-3">
          <div>
            <label
              for="example1"
              class="mb-1 block text-lg font-medium text-gray-700 py-1"
            >
              Description
            </label>
            <textarea
              type="text"
              id="example1"
              class="block w-full rounded-md border border-gray-300 shadow-sm 
              focus:border-primary-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50 disabled:cursor-not-allowed
               disabled:bg-gray-50 disabled:text-gray-500 p-3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Product Description"
            />
          </div>
        </div>
        <div className=" mx-auto my-3">
          <div>
            <label
              for="example1"
              class="mb-1 block text-lg font-medium text-gray-700 py-1"
            >
              Price
            </label>
            <input
              type="number"
              id="example1"
              class="block w-full rounded-md border border-gray-300 shadow-sm 
              focus:border-primary-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50 disabled:cursor-not-allowed
               disabled:bg-gray-50 disabled:text-gray-500 p-3"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Product Price"
            />
          </div>
        </div>
        <div className=" mx-auto my-3">
          <div>
            <button
              className="inline-block rounded border border-current px-8 py-3 text-sm font-medium text-green-600 transition hover:scale-110 hover:bg-green-400 hover:text-black hover:shadow-xl focus:outline-none focus:ring active:text-green-500 w-full"
              type="submit"
            >
              save Product
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
