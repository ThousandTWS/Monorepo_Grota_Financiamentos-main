"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, User, ArrowRight } from "lucide-react";

interface Post {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  categoryName: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  featured: boolean;
}

function BoxPostsListFromJSON() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [displayCount, setDisplayCount] = useState(6);

  useEffect(() => {
    fetch("/data/blog-posts.json").
    then((res) => res.json()).
    then((data) => {
      // Filter out featured post and sort by date
      const nonFeatured = data.posts.
      filter((post: Post) => !post.featured).
      sort(
        (a: Post, b: Post) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setPosts(nonFeatured);
    });
  }, []);

  const visiblePosts = posts.slice(0, displayCount);
  const hasMore = posts.length > displayCount;

  const loadMore = () => {
    setDisplayCount((prev) => prev + 6);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-oid=".guuy0g">
      <div className="text-center mb-12" data-oid="84jsmlh">
        <h2
          className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
          data-oid="mymx04n">

          Últimos Artigos
        </h2>
        <p
          className="text-lg text-gray-600 max-w-3xl mx-auto"
          data-oid="k8.f1ua">

          Fique por dentro das últimas novidades e dicas sobre financiamento
        </p>
      </div>

      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        data-oid="9qbvv7e">

        {visiblePosts.map((post) =>
        <article
          key={post.id}
          className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 group hover:-translate-y-2"
          data-oid="z8tvvs5">

            {/* Image */}
            <Link href={`/blog/artigo/${post.slug}`} data-oid="_tb0jbd">
              <div className="relative h-48 overflow-hidden" data-oid="n9npxd:">
                <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                data-oid="ds.0c7v" />


                <div className="absolute top-4 left-4" data-oid="sm_h.-g">
                  <Link
                  href={`/blog/categoria/${post.category}`}
                  data-oid="ugvp7iq">

                    <span
                    className="bg-[#1B4B7C] text-white px-3 py-1 rounded-full text-xs font-semibold hover:bg-[#153a5f] transition-colors"
                    data-oid="2e1udq2">

                      {post.categoryName}
                    </span>
                  </Link>
                </div>
              </div>
            </Link>

            {/* Content */}
            <div className="p-6" data-oid="z5yw:-y">
              <div
              className="flex items-center gap-4 mb-3 text-xs text-gray-500"
              data-oid=".rz2mug">

                <div className="flex items-center gap-1" data-oid="p4k6cti">
                  <Calendar
                  size={14}
                  className="text-[#1B4B7C]"
                  data-oid="ff-fg_9" />

                  <span data-oid="olfoun2">
                    {new Date(post.date).toLocaleDateString("pt-BR")}
                  </span>
                </div>
                <div className="flex items-center gap-1" data-oid="hlp2.2-">
                  <Clock
                  size={14}
                  className="text-[#1B4B7C]"
                  data-oid="g71opz0" />

                  <span data-oid=".4rzapc">{post.readTime}</span>
                </div>
              </div>

              <Link href={`/blog/artigo/${post.slug}`} data-oid="avf6zw8">
                <h3
                className="text-xl font-bold text-gray-800 mb-3 leading-tight group-hover:text-[#1B4B7C] transition-colors line-clamp-2"
                data-oid="w85uk99">

                  {post.title}
                </h3>
              </Link>

              <p
              className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3"
              data-oid="0h53n:7">

                {post.excerpt}
              </p>

              <div
              className="flex items-center justify-between pt-4 border-t border-gray-200"
              data-oid="egljhia">

                <div
                className="flex items-center gap-2 text-sm text-gray-600"
                data-oid="udc9gz:">

                  <User
                  size={16}
                  className="text-[#1B4B7C]"
                  data-oid="g_rb5-y" />

                  <span data-oid="o16ry74">{post.author}</span>
                </div>
                <Link
                href={`/blog/artigo/${post.slug}`}
                className="text-[#1B4B7C] font-semibold text-sm flex items-center gap-2 hover:gap-3 transition-all group/btn"
                data-oid="ho:dwib">

                  Ler mais
                  <ArrowRight
                  size={16}
                  className="group-hover/btn:translate-x-1 transition-transform"
                  data-oid="ar5oq0w" />

                </Link>
              </div>
            </div>
          </article>
        )}
      </div>

      {/* Load More Button */}
      {hasMore &&
      <div className="text-center mt-12" data-oid="j7ev3_3">
          <button
          onClick={loadMore}
          className="bg-[#1B4B7C] hover:bg-[#153a5f] text-white px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          data-oid="5dg28lg">

            Carregar Mais Artigos
          </button>
        </div>
      }
    </div>);

}

export default BoxPostsListFromJSON;