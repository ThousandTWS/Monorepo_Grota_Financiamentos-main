"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  Heart,
  Eye,
  Share2,
  Tag } from
"lucide-react";

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
  content: string;
  category: string;
  categoryName: string;
  author: string;
  authorAvatar: string;
  date: string;
  readTime: string;
  image: string;
  tags: string[];
  views: number;
  likes: number;
}

export default function ArtigoPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [liked, setLiked] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isScrolled = useScrollDetection(100);
  const modalManager = useModalManager();

  useTheme("dark");

  useEffect(() => {
    fetch("/data/blog-posts.json").
    then((res) => res.json()).
    then((data) => {
      const foundPost = data.posts.find((p: Post) => p.slug === slug);
      setPost(foundPost || null);

      if (foundPost) {
        const related = data.posts.
        filter(
          (p: Post) =>
          p.category === foundPost.category && p.id !== foundPost.id
        ).
        slice(0, 3);
        setRelatedPosts(related);
      }
    });
  }, [slug]);

  const handleMobileLoginClick = useCallback(() => {
    setIsMobileMenuOpen(false);
    modalManager.openLoginModal();
  }, [modalManager]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        url: window.location.href
      });
    }
  };

  if (!post) {
    return (
      <div className="min-h-screen w-full relative bg-white" data-oid="pu_il0_">
        <DesktopHeader
          isScrolled={isScrolled}
          onLoginClick={modalManager.openLoginModal}
          data-oid="5fvkyx3" />

        <MobileHeader
          isMobileMenuOpen={isMobileMenuOpen}
          onMenuToggle={toggleMobileMenu}
          data-oid="lg3srsn" />

        <MobileMenu
          isOpen={isMobileMenuOpen}
          onLoginClick={handleMobileLoginClick}
          data-oid="kisfn9n" />


        <main className="py-32 px-4" data-oid="i35a3nk">
          <div className="max-w-4xl mx-auto text-center" data-oid="rpqfh.9">
            <h1
              className="text-4xl font-bold text-gray-800 mb-4"
              data-oid="-z-k33g">

              Artigo não encontrado
            </h1>
            <p className="text-gray-600 mb-8" data-oid="9vh4lf2">
              O artigo que você procura não existe ou foi removido.
            </p>
            <Link
              href="/blog"
              className="bg-[#1B4B7C] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#153a5f] transition-all"
              data-oid="vy0nsw-">

              Voltar ao Blog
            </Link>
          </div>
        </main>

        <Footer data-oid="hzlclfp" />
        <ModalContainer {...modalManager} data-oid="ig6medn" />
      </div>);

  }

  return (
    <div className="min-h-screen w-full relative bg-white" data-oid="9cxy3:4">
      <DesktopHeader
        isScrolled={isScrolled}
        onLoginClick={modalManager.openLoginModal}
        data-oid="xp73jl8" />

      <MobileHeader
        isMobileMenuOpen={isMobileMenuOpen}
        onMenuToggle={toggleMobileMenu}
        data-oid="3-o3e94" />

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onLoginClick={handleMobileLoginClick}
        data-oid="3n:xi8v" />


      <main className="pt-24 pb-16" data-oid="ynz1b_v">
        {/* Back Button */}
        <div
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8"
          data-oid="kz3ygok">

          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[#1B4B7C] hover:text-[#153a5f] font-semibold transition-colors"
            data-oid="io8ccxz">

            <ArrowLeft size={20} data-oid="gs.j1ji" />
            Voltar ao Blog
          </Link>
        </div>

        {/* Article Header */}
        <article
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
          data-oid="zngd_59">

          {/* Category Badge */}
          <div className="mb-6" data-oid="o_buogy">
            <Link
              href={`/blog/categoria/${post.category}`}
              className="inline-block bg-blue-100 text-[#1B4B7C] px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-200 transition-colors"
              data-oid="r.yu23-">

              {post.categoryName}
            </Link>
          </div>

          {/* Title */}
          <h1
            className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight"
            data-oid=":y9ljd7">

            {post.title}
          </h1>

          {/* Meta Info */}
          <div
            className="flex flex-wrap items-center gap-6 mb-8 text-gray-600"
            data-oid="1w_edh.">

            <div className="flex items-center gap-2" data-oid="elw209r">
              <Image
                src={post.authorAvatar}
                alt={post.author}
                width={40}
                height={40}
                className="rounded-full"
                data-oid="ng7:g65" />


              <span className="font-medium" data-oid="dkw4wbi">
                {post.author}
              </span>
            </div>
            <div className="flex items-center gap-2" data-oid="vce56u3">
              <Calendar
                size={18}
                className="text-[#1B4B7C]"
                data-oid="unse2v0" />

              <span data-oid="pnewu34">
                {new Date(post.date).toLocaleDateString("pt-BR")}
              </span>
            </div>
            <div className="flex items-center gap-2" data-oid="o7v_nrb">
              <Clock size={18} className="text-[#1B4B7C]" data-oid=":s.vaxh" />
              <span data-oid="lx_6m:2">{post.readTime}</span>
            </div>
            <div className="flex items-center gap-2" data-oid="293s17q">
              <Eye size={18} className="text-[#1B4B7C]" data-oid="5xkwsq8" />
              <span data-oid=":d95kjn">{post.views} visualizações</span>
            </div>
          </div>

          {/* Featured Image */}
          <div
            className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden mb-12"
            data-oid="1ip4s4p">

            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              data-oid="jyldgr_" />

          </div>

          {/* Action Buttons */}
          <div
            className="flex items-center gap-4 mb-12 pb-8 border-b border-gray-200"
            data-oid=":ej_:9v">

            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
              liked ?
              "bg-red-100 text-red-600" :
              "bg-gray-100 text-gray-600 hover:bg-gray-200"}`
              }
              data-oid=".gzq89q">

              <Heart
                size={20}
                fill={liked ? "currentColor" : "none"}
                data-oid="_x8uzqi" />

              {post.likes + (liked ? 1 : 0)}
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              data-oid="tzxe43b">

              <Share2 size={20} data-oid="xgu37i2" />
              Compartilhar
            </button>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none mb-12" data-oid="u36j5b:">
            {post.content.split("\n").map((paragraph, index) => {
              if (paragraph.startsWith("# ")) {
                return (
                  <h1
                    key={index}
                    className="text-3xl font-bold text-gray-800 mb-6 mt-8"
                    data-oid="45d6r9i">

                    {paragraph.replace("# ", "")}
                  </h1>);

              } else if (paragraph.startsWith("## ")) {
                return (
                  <h2
                    key={index}
                    className="text-2xl font-bold text-gray-800 mb-4 mt-6"
                    data-oid="u0gf2l1">

                    {paragraph.replace("## ", "")}
                  </h2>);

              } else if (paragraph.startsWith("### ")) {
                return (
                  <h3
                    key={index}
                    className="text-xl font-bold text-gray-800 mb-3 mt-4"
                    data-oid="q4q1c_7">

                    {paragraph.replace("### ", "")}
                  </h3>);

              } else if (paragraph.startsWith("- ")) {
                return (
                  <li
                    key={index}
                    className="text-gray-700 leading-relaxed ml-6"
                    data-oid="ariwvrg">

                    {paragraph.replace("- ", "")}
                  </li>);

              } else if (paragraph.trim() === "") {
                return <br key={index} data-oid="11pt1gl" />;
              } else if (paragraph.startsWith("```")) {
                return null;
              } else {
                return (
                  <p
                    key={index}
                    className="text-gray-700 leading-relaxed mb-4"
                    data-oid="u:ya7:l">

                    {paragraph}
                  </p>);

              }
            })}
          </div>

          {/* Tags */}
          <div
            className="flex flex-wrap items-center gap-2 mb-12 pb-8 border-b border-gray-200"
            data-oid="neb9x2w">

            <Tag size={20} className="text-gray-600" data-oid="ymazeps" />
            {post.tags.map((tag, index) =>
            <span
              key={index}
              className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium"
              data-oid="dzyoctg">

                #{tag}
              </span>
            )}
          </div>

          {/* Author Bio */}
          <div
            className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 mb-12"
            data-oid="-wm8hmi">

            <div className="flex items-start gap-4" data-oid="slaeyz_">
              <Image
                src={post.authorAvatar}
                alt={post.author}
                width={80}
                height={80}
                className="rounded-full"
                data-oid="idfhxsu" />


              <div data-oid="rbsmhwk">
                <h3
                  className="text-xl font-bold text-gray-800 mb-2"
                  data-oid="lguw3_0">

                  Sobre {post.author}
                </h3>
                <p className="text-gray-700" data-oid="3s2rdi-">
                  Especialista em financiamento veicular com anos de experiência
                  no mercado. Dedicado a ajudar pessoas a realizarem o sonho do
                  carro próprio.
                </p>
              </div>
            </div>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 &&
          <div data-oid="6c6qqd.">
              <h2
              className="text-3xl font-bold text-gray-800 mb-8"
              data-oid="9eu871f">

                Artigos Relacionados
              </h2>
              <div
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              data-oid="kip1c8:">

                {relatedPosts.map((relatedPost) =>
              <Link
                key={relatedPost.id}
                href={`/blog/artigo/${relatedPost.slug}`}
                className="group"
                data-oid="9xe_z80">

                    <div
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300"
                  data-oid="7tg3e93">

                      <div className="relative h-48" data-oid="g9ou8w_">
                        <Image
                      src={relatedPost.image}
                      alt={relatedPost.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      data-oid="mhrfwc4" />

                      </div>
                      <div className="p-4" data-oid="dl09am7">
                        <h3
                      className="font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-[#1B4B7C] transition-colors"
                      data-oid="dg1.9_o">

                          {relatedPost.title}
                        </h3>
                        <div
                      className="flex items-center gap-2 text-sm text-gray-600"
                      data-oid="frlvs.y">

                          <Clock size={14} data-oid="xf.bmrr" />
                          <span data-oid="5f1duyl">{relatedPost.readTime}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
              )}
              </div>
            </div>
          }
        </article>
      </main>

      <Footer data-oid="hnx8phl" />
      <ModalContainer {...modalManager} data-oid="fh0p57f" />
    </div>);

}