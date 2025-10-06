"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, User, ArrowRight, ArrowLeft } from "lucide-react";

import { useTheme } from "@/src/presentation/layout/navbar/hooks/useTheme";
import { useModalManager } from "@/src/presentation/layout/navbar/hooks/useModalManager";
import { useScrollDetection } from "@/src/presentation/layout/navbar/hooks/useScrollDetection";

import { DesktopHeader } from "@/src/presentation/layout/navbar/components/Header/DesktopHeader";
import { MobileHeader } from "@/src/presentation/layout/navbar/components/Header/MobileHeader";
import { MobileMenu } from "@/src/presentation/layout/navbar/components/Header/MobileMenu";
import Footer from "@/src/presentation/layout/Footer/Footer";
import { ModalContainer } from "@/src/presentation/layout/modais/ModalContainer";

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
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
}

export default function CategoriaPage() {
  const params = useParams();
  const categoria = params.categoria as string;

  const [posts, setPosts] = useState<Post[]>([]);
  const [categoryInfo, setCategoryInfo] = useState<Category | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isScrolled = useScrollDetection(100);
  const modalManager = useModalManager();

  useTheme("dark");

  useEffect(() => {
    fetch("/data/blog-posts.json").
    then((res) => res.json()).
    then((data) => {
      const filteredPosts = data.posts.filter(
        (p: Post) => p.category === categoria
      );
      setPosts(filteredPosts);

      const cat = data.categories.find((c: Category) => c.slug === categoria);
      setCategoryInfo(cat || null);
    });
  }, [categoria]);

  const handleMobileLoginClick = useCallback(() => {
    setIsMobileMenuOpen(false);
    modalManager.openLoginModal();
  }, [modalManager]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  return (
    <div className="min-h-screen w-full relative bg-white" data-oid="q4kln:s">
      <DesktopHeader
        isScrolled={isScrolled}
        onLoginClick={modalManager.openLoginModal}
        data-oid="dxe8iks" />

      <MobileHeader
        isMobileMenuOpen={isMobileMenuOpen}
        onMenuToggle={toggleMobileMenu}
        data-oid="tf92_dw" />

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onLoginClick={handleMobileLoginClick}
        data-oid="1fvzv:e" />


      <main className="pt-24 pb-16" data-oid="4gh81qn">
        {/* Back Button */}
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8"
          data-oid="ywqit8t">

          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[#1B4B7C] hover:text-[#153a5f] font-semibold transition-colors"
            data-oid=".4pe18z">

            <ArrowLeft size={20} data-oid="6syus2r" />
            Voltar ao Blog
          </Link>
        </div>

        {/* Category Header */}
        {categoryInfo &&
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12"
          data-oid="ehky9kf">

            <div
            className="bg-gradient-to-br from-[#1B4B7C] to-[#153a5f] rounded-2xl p-12 text-center"
            data-oid="ti8.aqy">

              <h1
              className="text-4xl md:text-5xl font-bold text-white mb-4"
              data-oid="v63u5bs">

                {categoryInfo.name}
              </h1>
              <p className="text-xl text-blue-100 mb-4" data-oid="uween6n">
                {categoryInfo.description}
              </p>
              <p className="text-blue-200" data-oid="7c8jf4v">
                {posts.length} {posts.length === 1 ? "artigo" : "artigos"} nesta
                categoria
              </p>
            </div>
          </div>
        }

        {/* Posts Grid */}
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          data-oid="fb71.th">

          {posts.length === 0 ?
          <div className="text-center py-16" data-oid="uc_0jed">
              <h2
              className="text-2xl font-bold text-gray-800 mb-4"
              data-oid="6ns.xuh">

                Nenhum artigo encontrado
              </h2>
              <p className="text-gray-600 mb-8" data-oid="v0yl_dm">
                Ainda não há artigos nesta categoria. Volte em breve!
              </p>
              <Link
              href="/blog"
              className="bg-[#1B4B7C] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#153a5f] transition-all inline-block"
              data-oid="eczxddk">

                Ver Todos os Artigos
              </Link>
            </div> :

          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            data-oid="igw3h:f">

              {posts.map((post) =>
            <article
              key={post.id}
              className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 group hover:-translate-y-2"
              data-oid="jsa-v35">

                  {/* Image */}
                  <Link href={`/blog/artigo/${post.slug}`} data-oid="3pm14wc">
                    <div
                  className="relative h-48 overflow-hidden"
                  data-oid="z28a4x0">

                      <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    data-oid="_yxxhh7" />


                      <div className="absolute top-4 left-4" data-oid="o3609wt">
                        <span
                      className="bg-[#1B4B7C] text-white px-3 py-1 rounded-full text-xs font-semibold"
                      data-oid="0gl8e7t">

                          {post.categoryName}
                        </span>
                      </div>
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="p-6" data-oid="kz3q4u5">
                    <div
                  className="flex items-center gap-4 mb-3 text-xs text-gray-500"
                  data-oid=":evaozq">

                      <div
                    className="flex items-center gap-1"
                    data-oid="mj596tg">

                        <Calendar
                      size={14}
                      className="text-[#1B4B7C]"
                      data-oid="d72pbf:" />

                        <span data-oid="ukxeewo">
                          {new Date(post.date).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                      <div
                    className="flex items-center gap-1"
                    data-oid="f6ye.-5">

                        <Clock
                      size={14}
                      className="text-[#1B4B7C]"
                      data-oid="_s8r7rn" />

                        <span data-oid=":te7f0e">{post.readTime}</span>
                      </div>
                    </div>

                    <Link href={`/blog/artigo/${post.slug}`} data-oid="zmm:lx.">
                      <h3
                    className="text-xl font-bold text-gray-800 mb-3 leading-tight group-hover:text-[#1B4B7C] transition-colors line-clamp-2"
                    data-oid="dajr08j">

                        {post.title}
                      </h3>
                    </Link>

                    <p
                  className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3"
                  data-oid="xa3wo00">

                      {post.excerpt}
                    </p>

                    <div
                  className="flex items-center justify-between pt-4 border-t border-gray-200"
                  data-oid="5ic79uz">

                      <div
                    className="flex items-center gap-2 text-sm text-gray-600"
                    data-oid="y0_td2j">

                        <User
                      size={16}
                      className="text-[#1B4B7C]"
                      data-oid="1hxja08" />

                        <span data-oid="nk8mrmm">{post.author}</span>
                      </div>
                      <Link
                    href={`/blog/artigo/${post.slug}`}
                    className="text-[#1B4B7C] font-semibold text-sm flex items-center gap-2 hover:gap-3 transition-all group/btn"
                    data-oid="pp4i3oh">

                        Ler mais
                        <ArrowRight
                      size={16}
                      className="group-hover/btn:translate-x-1 transition-transform"
                      data-oid="au8i3.z" />

                      </Link>
                    </div>
                  </div>
                </article>
            )}
            </div>
          }
        </div>
      </main>

      <Footer data-oid="rp4bbsi" />
      <ModalContainer {...modalManager} data-oid="txmd3a7" />
    </div>);

}