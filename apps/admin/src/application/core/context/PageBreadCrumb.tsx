/* eslint-disable react/no-unknown-property */
import Link from "next/link";
import React from "react";
import { BreadcrumbProps } from "../@types/Props/BreadcrumbProps";

const PageBreadcrumb: React.FC<BreadcrumbProps> = ({ pageTitle }) => {
  return (
    <div
      className="flex flex-wrap items-center justify-between gap-3 mb-6"
      data-oid="ih92pb-">

      <h2
        className="text-xl font-semibold text-gray-800 dark:text-white/90"
        x-text="pageName"
        data-oid="1er.6ff">

        {pageTitle}
      </h2>
      <nav data-oid="c:4iuw2">
        <ol className="flex items-center gap-1.5" data-oid=".b2lklt">
          <li data-oid="dqm69fv">
            <Link
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
              href="/"
              data-oid="c1so:wk">

              Home
              <svg
                className="stroke-current"
                width="17"
                height="16"
                viewBox="0 0 17 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                data-oid="o5ig2-7">

                <path
                  d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                  stroke=""
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  data-oid="p7hsb6v" />

              </svg>
            </Link>
          </li>
          <li
            className="text-sm text-gray-800 dark:text-white/90"
            data-oid="gz2xvn:">

            {pageTitle}
          </li>
        </ol>
      </nav>
    </div>);

};

export default PageBreadcrumb;