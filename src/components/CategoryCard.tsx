import React from 'react';
import { Sun, Moon, BedDouble, Sparkles, BookOpen, CircleDot, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { AthkarCategory } from '../data/athkarData';
import { athkarSpeech } from '../utils/athkarSpeech';

interface CategoryCardProps {
  category: AthkarCategory;
  totalCount: number;
  completedCount: number;
  onSelect: (categoryId: AthkarCategory['id']) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  totalCount,
  completedCount,
  onSelect,
}) => {
  const isFullyCompleted = totalCount > 0 && completedCount >= totalCount;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleClick = () => {
    // Announce category title using male voice as requested
    athkarSpeech.speakNavigation(category.name);
    onSelect(category.id);
  };

  const getIcon = () => {
    switch (category.iconName) {
      case 'Sun':
        return <Sun className="w-6 h-6 text-amber-600" />;
      case 'Moon':
        return <Moon className="w-6 h-6 text-emerald-700" />;
      case 'BedDouble':
        return <BedDouble className="w-6 h-6 text-indigo-600" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-teal-600" />;
      case 'BookOpen':
        return <BookOpen className="w-6 h-6 text-amber-700" />;
      case 'CircleDot':
        return <CircleDot className="w-6 h-6 text-emerald-600" />;
      default:
        return <Sparkles className="w-6 h-6 text-emerald-600" />;
    }
  };

  return (
    <button
      id={`cat-btn-${category.id}`}
      onClick={handleClick}
      className={`group w-full text-right p-5 sm:p-6 rounded-3xl border transition-all duration-200 cursor-pointer shadow-xs active:scale-[0.99] flex flex-col justify-between ${
        isFullyCompleted
          ? 'bg-emerald-50/80 border-emerald-300 hover:border-emerald-400'
          : 'bg-[#FCFAF7] border-stone-200/90 hover:border-emerald-400 hover:bg-white hover:shadow-md'
      }`}
    >
      <div>
        {/* Top bar with icon and badge */}
        <div className="flex items-center justify-between gap-3 mb-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#F3ECE1] flex items-center justify-center group-hover:scale-105 transition-transform">
            {getIcon()}
          </div>

          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-stone-100 text-stone-700 border border-stone-200/70">
            {category.badge}
          </span>
        </div>

        {/* Category Title */}
        <h3 className="text-lg sm:text-xl font-bold text-stone-900 group-hover:text-emerald-900 transition-colors mb-1.5 flex items-center justify-between">
          <span>{category.name}</span>
          <ChevronLeft className="w-5 h-5 text-stone-600 group-hover:text-emerald-800 group-hover:-translate-x-1 transition-all" />
        </h3>

        {/* Short Description */}
        <p className="text-xs sm:text-sm text-stone-600 line-clamp-2 leading-relaxed mb-4">
          {category.shortDesc}
        </p>
      </div>

      {/* Progress Footer */}
      <div className="pt-3 border-t border-stone-200/70">
        <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
          <span className="text-stone-700">
            {totalCount} أذكار
          </span>
          {isFullyCompleted ? (
            <span className="flex items-center gap-1 text-emerald-800 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>مكتملة بالكامل</span>
            </span>
          ) : (
            <span className="text-stone-700">
              أنجزت: {completedCount} من {totalCount}
            </span>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-stone-200/80 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              isFullyCompleted ? 'bg-emerald-600' : 'bg-emerald-700'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </button>
  );
};
