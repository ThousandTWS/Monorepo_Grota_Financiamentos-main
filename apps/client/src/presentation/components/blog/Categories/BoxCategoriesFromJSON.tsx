"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Car,
  DollarSign,
  TrendingUp,
  FileText,
  Shield,
  Users } from
"lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
}

const iconMap: Record<string, React.ElementType> = {
  Car,
  DollarSign,
  TrendingUp,
  FileText,
  Shield,
  Users
};

function BoxCategoriesFromJSON() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [postCounts, setPostCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    fetch("/data/blog-posts.json").
    then((res) => res.json()).
    then((data) => {
      setCategories(data.categories);

      // Count posts per category
      const counts: Record<string, number> = {};
      data.posts.forEach((post: any) => {
        counts[post.category] = (counts[post.category] || 0) + 1;
      });
      setPostCounts(counts);
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-oid="5m.tj5n">
      <div className="text-center mb-12" data-oid="de:so5h">
        <h2
          className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
          data-oid="vgejktw">

          Categorias
        </h2>
        <p
          className="text-lg text-gray-600 max-w-3xl mx-auto"
          data-oid="3.wsf4h">

          Navegue pelos nossos artigos organizados por categorias
        </p>
      </div>

      <div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        data-oid="h4-u7.x">

        {categories.map((category) => {
          const Icon = iconMap[category.icon] || Car;
          const count = postCounts[category.id] || 0;

          return (
            <Link
              key={category.id}
              href={`/blog/categoria/${category.slug}`}
              className="bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-[#1B4B7C] rounded-xl p-6 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 flex flex-col items-center gap-3 group"
              data-oid="-46fba-">

              <div
                className="bg-blue-100 text-[#1B4B7C] p-4 rounded-full group-hover:scale-110 transition-transform duration-300"
                data-oid="9e5zcei">

                <Icon size={28} data-oid="rpdt0_u" />
              </div>
              <div className="text-center" data-oid="ye3y9ec">
                <h3 className="font-bold text-gray-800 mb-1" data-oid="x4nc8kr">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500" data-oid="ukdy-gf">
                  {count} {count === 1 ? "post" : "posts"}
                </p>
              </div>
            </Link>);

        })}
      </div>
    </div>);

}

export default BoxCategoriesFromJSON;