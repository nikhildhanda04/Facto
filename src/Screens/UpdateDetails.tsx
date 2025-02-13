import Navbar from "@/Components/Navbar";
import { Search } from "lucide-react";
import { Input } from "@/Components/ui/input";
import Phone from "@/Components/Phone";
import Footer from "@/Components/Footer";
import { useEffect, useState } from "react";
import { Updates } from "@/api";
import BlogSkeleton from "@/Components/BlogSkeleton";


// "blog": {
//             "reference": {
//                 "title": "Link",
//                 "url": "https://example.com"
//             },
//             "_id": "67489bc2d4f4b2315368adf3",
//             "title": "How to Install Apps",
//             "content": "In our day to day use we use app store to install Apps",
//             "imageUrl": "https://res.cloudinary.com/diush63ly/image/upload/v1732811713/course_thumbnails/bh6asyo8ru4g2u3ouyph.jpg",
//             "author": "Anonymous",
//             "tags": [],
//             "createdAt": "2024-11-28T16:35:14.821Z",
//             "updatedAt": "2024-11-28T16:35:14.821Z",
//             "__v": 0
//         }
type Blog = {
  reference: {
    title: string;
    url: string;
  };
  _id: string;
  title: string;
  content: string;
  imageUrl: string;
  author: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const UpdateDetails = () => {
  const [id, setId] = useState<string | null>(null);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoadingBlog, setIsLoadingBlog] = useState(true);
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const fetchedId = queryParams.get('id');
    setId(fetchedId);

    async function fetchBlog() {
      const res = await Updates.getBlogById(fetchedId || "");
      console.log(res.data.blog);
      setBlog(res.data.blog);
      setIsLoadingBlog(false);
    }
    fetchBlog();
  }, [id]);

  function formatDate(isoDate: string) {
    const date = new Date(isoDate);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }


  //   date: "October 19, 2024",
  //   description:
  //     "What seemed like a one-off issue is starting to look like a trend. Growth in GST collection fell to 6.5%, its lowest in 40 months. The trade deficit widened to $29.7 billion in August from $24.2 billion a year earlier...",
  //   url: "https://www.example.com",
  //   additionalNews: [
  //     {
  //       title:
  //         "GST Collection Falls, Exports Drop: Is India's Economic Growth Slowing?",
  //       date: "October 20, 2024",
  //       description:
  //         "Exports dropped significantly due to sluggish economic activity worldwide. Experts predict further decline in upcoming months...",
  //       image: newsImg,
  //       url: "https://www.example1.com",
  //     },
  //     {
  //       title: "GST May Touch New Lows Amid Stagnant Revenue Collection Efforts",
  //       date: "October 21, 2024",
  //       description:
  //         "The government is considering revising tax slabs to address revenue gaps caused by decreased GST collections...",
  //       image: newsImg,
  //       url: "https://www.example2.com",
  //     },
  //   ],
  // };

  return (
    <div className="overflow-hidden">
      <Navbar />

      <div className="mt-5 flex items-center justify-center pl-[180px] pt-[84px]">
        <div className="flex items-center bg-white rounded-full w-[762px] mr-[auto] px-4 py-2" style={{ boxShadow: "0px 0.94px 6.57px 0px #00000040" }}>
          <Search size={20} className="text-gray-500 mr-3" />
          <Input
            type="text"
            placeholder="Search"
            className="flex-1 text-sm placeholder:text-gray-500 border-none shadow-none"
          />
          <button className="ml-3 bg-secondary text-white rounded-full px-4 py-1 text-sm font-[lora]">
            Search
          </button>
        </div>
      </div>

      {isLoadingBlog ? <BlogSkeleton /> : (
        <div className="p-8 flex flex-col items-center">

          <div className="w-[80%] max-w-[1300px] flex flex-col items-center text-left mb-10">
            <ul className="list-disc pl-5 w-full">
              <li className="text-2xl font-[erode] font-bold text-gray-800">
                {blog?.title}
              </li>
            </ul>

            <img
              src={blog?.imageUrl}
              alt="News"
              className="w-full h-[344px] mt-5 object-cover rounded-md"
            />

            <p className="text-gray-600 font-[poppins] font-[300] mr-[auto] text-sm mt-4">{formatDate(blog?.createdAt || "")}</p>

            <p className="text-gray-700 font-[poppins] font-[300] mt-8 leading-6">{blog?.content}</p>

            <p className="text-gray-700 mr-[auto] font-[erode] font-[600] mt-8">
              URL:{" "}
              <a
                href={blog?.reference.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                {blog?.reference.url}
              </a>
            </p>
          </div>


          {/* {newsDetails.additionalNews.map((news, index) => (
          <div
            key={index}
            className="w-[80%] max-w-[1300px] flex flex-col items-center text-left mt-[50px] mb-[50px] border-t border-gray-300 pt-6"
          >
            <ul className="list-disc pl-5 w-full">
              <li className="text-2xl font-bold text-gray-800">{news.title}</li>
            </ul>

            <img
              src={news.image}
              alt="Additional News"
              className="w-full h-[344px] mt-5 object-cover rounded-md"
            />

            <p className="text-gray-600 font-[poppins] font-[300] mr-[auto] text-sm mt-4">{news.date}</p>

            <p className="text-gray-700 font-[poppins] font-[300] mr-[auto] mt-4 leading-6">{news.description}</p>

            <p className="text-gray-700 mr-[auto] font-[erode] font-[600] mt-4">
              URL:{" "}
              <a
                href={news.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                {news.url}
              </a>
            </p>
          </div>
        ))} */}

        </div>
      )}



      <div className="bg-[#E9FFE9]">
        <Phone />
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default UpdateDetails;
