"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
    Search
} from
    "lucide-react";
import { cn } from "@/lib/utils";
import { SearchItem } from "../@types/SearchGlobal/SearchItem";
import { searchItems } from "../@types/SearchGlobal/links/SearchItems";

export function GlobalSearch() {
    const [searchQuery, setSearchQuery] = React.useState("");
    const [isOpen, setIsOpen] = React.useState(false);
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const router = useRouter();
    const inputRef = React.useRef<HTMLInputElement>(null);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    const filteredItems = React.useMemo(() => {
        if (!searchQuery.trim()) return [];

        const query = searchQuery.toLowerCase();
        return searchItems.filter((item) => {
            const matchTitle = item.title.toLowerCase().includes(query);
            const matchDescription = item.description?.toLowerCase().includes(query);
            const matchKeywords = item.keywords?.some((keyword) =>
                keyword.toLowerCase().includes(query)
            );
            return matchTitle || matchDescription || matchKeywords;
        });
    }, [searchQuery]);

    const groupedResults = React.useMemo(() => {
        const grouped: Record<string, SearchItem[]> = {};
        filteredItems.forEach((item) => {
            if (!grouped[item.group]) {
                grouped[item.group] = [];
            }
            grouped[item.group].push(item);
        });
        return grouped;
    }, [filteredItems]);

    const handleSelect = (href: string) => {
        router.push(href);
        setSearchQuery("");
        setIsOpen(false);
        inputRef.current?.blur();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen || filteredItems.length === 0) return;

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setSelectedIndex((prev) =>
                    prev < filteredItems.length - 1 ? prev + 1 : prev
                );
                break;
            case "ArrowUp":
                e.preventDefault();
                setSelectedIndex((prev) => prev > 0 ? prev - 1 : prev);
                break;
            case "Enter":
                e.preventDefault();
                if (filteredItems[selectedIndex]) {
                    handleSelect(filteredItems[selectedIndex].href);
                }
                break;
            case "Escape":
                setIsOpen(false);
                inputRef.current?.blur();
                break;
        }
    };

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                !inputRef.current?.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    return (
        <div className="relative w-full xl:w-[430px]" data-oid="m.81ozg">
            <div className="relative" data-oid="ccnf6iv">
                <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-500 dark:text-gray-400 pointer-events-none"
                    data-oid="5wt19f2" />

                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Pesquisar..."
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setIsOpen(true);
                        setSelectedIndex(0);
                    }}
                    onFocus={() => searchQuery && setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    className="h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 transition-colors"
                    data-oid="mabd6oq" />


                <kbd
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 hidden h-6 select-none items-center gap-1 rounded border border-gray-200 bg-gray-100 px-1.5 font-mono text-[10px] font-medium text-gray-600 opacity-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 sm:flex"
                    data-oid="14gak9t">

                    <span className="text-xs" data-oid="xuk5wj:">
                        ⌘
                    </span>
                    K
                </kbd>
            </div>

            {isOpen && filteredItems.length > 0 &&
                <div
                    ref={dropdownRef}
                    className="absolute top-full left-0 right-0 mt-2 max-h-[400px] overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900 z-50 animate-in fade-in-0 zoom-in-95"
                    data-oid="g:o6g6y">

                    {Object.entries(groupedResults).map(([group, items], groupIndex) =>
                        <div key={group} data-oid="n:yoq9a">
                            {groupIndex > 0 &&
                                <div
                                    className="border-t border-gray-200 dark:border-gray-800"
                                    data-oid="kr-lpdf" />

                            }
                            <div className="px-2 py-1.5" data-oid="nlu_a6b">
                                <div
                                    className="px-2 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400"
                                    data-oid="fgs8s66">

                                    {group}
                                </div>
                                {items.map((item,) => {
                                    const globalIndex = filteredItems.indexOf(item);
                                    const isSelected = globalIndex === selectedIndex;

                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => handleSelect(item.href)}
                                            onMouseEnter={() => setSelectedIndex(globalIndex)}
                                            className={cn(
                                                "w-full flex items-start gap-3 rounded-md px-2 py-2.5 text-left transition-colors",
                                                isSelected ?
                                                    "bg-gray-100 dark:bg-gray-800" :
                                                    "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                            )}
                                            data-oid="gben91b">

                                            <div
                                                className="flex-shrink-0 mt-0.5 text-gray-500 dark:text-gray-400"
                                                data-oid="0t4z7qf">

                                                {item.icon}
                                            </div>
                                            <div className="flex-1 min-w-0" data-oid="zku_oaq">
                                                <div
                                                    className="font-medium text-sm text-gray-900 dark:text-white"
                                                    data-oid="fbrxy4c">

                                                    {item.title}
                                                </div>
                                                {item.description &&
                                                    <div
                                                        className="text-xs text-gray-500 dark:text-gray-400 truncate"
                                                        data-oid="hro-qjq">

                                                        {item.description}
                                                    </div>
                                                }
                                            </div>
                                            {isSelected &&
                                                <kbd
                                                    className="hidden sm:inline-flex h-5 items-center rounded border border-gray-200 bg-gray-100 px-1.5 font-mono text-[10px] font-medium text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                                                    data-oid="-h72q:g">

                                                    ↵
                                                </kbd>
                                            }
                                        </button>);

                                })}
                            </div>
                        </div>
                    )}
                </div>
            }

            {isOpen && searchQuery && filteredItems.length === 0 &&
                <div
                    ref={dropdownRef}
                    className="absolute top-full left-0 right-0 mt-2 rounded-lg border border-gray-200 bg-white p-4 text-center text-sm text-gray-500 shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 z-50 animate-in fade-in-0 zoom-in-95"
                    data-oid="5c.xjc.">

                    Nenhum resultado encontrado para &quot;{searchQuery}&quot;
                </div>
            }
        </div>);

}