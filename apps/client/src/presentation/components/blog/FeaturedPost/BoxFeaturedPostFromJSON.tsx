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
  tags: string[];
  featured: boolean;
}

function BoxFeaturedPostFromJSON() {
  const [featuredPost, setFeaturedPost] = useState<Post | null>(null);

  useEffect(() => {
    fetch("/data/blog-posts.json").
    then((res) => res.json()).
    then((data) => {
      const featured = data.posts.find((post: Post) => post.featured);
      setFeaturedPost(featured || data.posts[0]);
    });
  }, []);

  if (!featuredPost) {
    return (
      <div className="text-center py-16" data-oid="q9tx35y">
        Carregando...
      </div>);

  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-oid="g_ee:wi">
      <div className="text-center mb-12" data-oid="4-:1_4z">
        <h2
          className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
          data-oid="pt1qqco">

          Post em Destaque
        </h2>
        <p
          className="text-lg text-gray-600 max-w-3xl mx-auto"
          data-oid="sz2dmg1">

          O artigo mais relevante desta semana
        </p>
      </div>

      <div
        className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl overflow-hidden border border-gray-200"
        data-oid="e1_4d99">

        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-0"
          data-oid="ffgdc8y">

          {/* Image */}
          <div
            className="relative h-80 lg:h-full min-h-[400px]"
            data-oid=".73dfxm">

            <Image
              src={featuredPost.image}
              alt={featuredPost.title}
              fill
              className="object-cover"
              data-oid="m4yaszk" />


            <div className="absolute top-4 left-4" data-oid="qvcnfal">
              <span
                className="bg-[#1B4B7C] text-white px-4 py-2 rounded-full text-sm font-semibold"
                data-oid="3gei32z">

                Destaque
              </span>
            </div>
          </div>

          {/* Content */}
          <div
            className="p-8 md:p-12 flex flex-col justify-center"
            data-oid="og_32hb">

            <div
              className="flex items-center gap-4 mb-6 text-sm text-gray-600"
              data-oid="4_ej:b-">

              <div className="flex items-center gap-2" data-oid="bzj-m_w">
                <Calendar
                  size={16}
                  className="text-[#1B4B7C]"
                  data-oid="xj6597z" />

                <span data-oid="fbddl6z">
                  {new Date(featuredPost.date).toLocaleDateString("pt-BR")}
                </span>
              </div>
              <div className="flex items-center gap-2" data-oid="f8_792:">
                <Clock
                  size={16}
                  className="text-[#1B4B7C]"
                  data-oid="zod0cyo" />

                <span data-oid="j4i8ogg">{featuredPost.readTime}</span>
              </div>
              <div className="flex items-center gap-2" data-oid="k2i4a_p">
                <User size={16} className="text-[#1B4B7C]" data-oid="53ls-g9" />
                <span data-oid="v9etznk">{featuredPost.author}</span>
              </div>
            </div>

            <h3
              className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 leading-tight"
              data-oid="-bb75yl">

              {featuredPost.title}
            </h3>

            <p
              className="text-lg text-gray-600 mb-6 leading-relaxed"
              data-oid="vsc3gl6">

              {featuredPost.excerpt}
            </p>

            <div className="flex flex-wrap gap-2 mb-8" data-oid="5lqi:sf">
              {featuredPost.tags.map((tag, index) =>
              <span
                key={index}
                className="bg-blue-100 text-[#1B4B7C] px-3 py-1 rounded-full text-sm font-medium"
                data-oid="krqqmlz">

                  {tag}
                </span>
              )}
            </div>

            <Link
              href={`/blog/artigo/${featuredPost.slug}`}
              className="bg-[#1B4B7C] hover:bg-[#153a5f] text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-3 self-start group"
              data-oid="-27auf7">

              Ler Artigo Completo
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
                data-oid="sm-_.uz" />

            </Link>
          </div>
        </div>
      </div>
    </div>);

}

export default BoxFeaturedPostFromJSON;