import type { SeedQuestion } from "./types";

/**
 * Curated DSA bank (cap: 300).
 *
 * Selection rule: the SMALLEST set that covers every required interview pattern,
 * not the largest pile of problems. Every entry earns its slot by teaching a
 * technique that transfers to other problems.
 *
 * Titles and links point at the canonical hosted version of each problem.
 * `prompt` is an original one-line restatement written for this app — we never
 * store the copyrighted problem statement itself. Solve on the linked site.
 */

type Row = [
  slug: string, // problem slug, also the source URL path
  topic: string,
  pattern: string,
  title: string,
  difficulty: "Easy" | "Medium" | "Hard",
  minutes: number,
  frequency: number,
  patternValue: number,
  companies: string,
  concepts: string,
  prompt: string,
];

const ROWS: Row[] = [
  // ============================ ARRAYS ============================
  ["best-time-to-buy-and-sell-stock", "arrays", "Running Minimum", "Best Time to Buy and Sell Stock", "Easy", 20, 92, 80, "amazon,microsoft,google,goldman-sachs", "single pass,running min,greedy scan", "Given daily prices, find the largest profit from one buy followed by one later sell."],
  ["maximum-subarray", "arrays", "Kadane", "Maximum Subarray", "Easy", 20, 95, 95, "amazon,microsoft,linkedin,adobe", "kadane,dp on arrays,running sum", "Find the contiguous block of numbers with the largest total."],
  ["maximum-product-subarray", "arrays", "Kadane Variant", "Maximum Product Subarray", "Medium", 30, 78, 85, "amazon,linkedin,microsoft", "kadane,sign tracking,min and max state", "Find the contiguous block whose product is largest, where negatives can flip the sign."],
  ["product-of-array-except-self", "arrays", "Prefix and Suffix", "Product of Array Except Self", "Medium", 25, 90, 92, "amazon,meta,microsoft,apple", "prefix products,suffix products,no division", "For each index, produce the product of every other element without using division."],
  ["running-sum-of-1d-array", "arrays", "Prefix Sum", "Running Sum of 1d Array", "Easy", 20, 62, 70, "amazon,walmart", "prefix sum,in-place accumulation", "Turn an array into its cumulative totals."],
  ["find-pivot-index", "arrays", "Prefix Sum", "Find Pivot Index", "Easy", 20, 70, 78, "amazon,google", "prefix sum,left-right balance", "Find the index where the sum to its left equals the sum to its right."],
  ["range-sum-query-immutable", "arrays", "Prefix Sum", "Range Sum Query - Immutable", "Easy", 20, 66, 80, "meta,amazon", "prefix sum,precomputation,range query", "Preprocess an array so any range total can be answered in constant time."],
  ["rotate-array", "arrays", "Cyclic Rotation", "Rotate Array", "Medium", 25, 80, 75, "amazon,microsoft,adobe", "reversal trick,cyclic replacement,in-place", "Shift every element right by k positions using no extra array."],
  ["move-zeroes", "arrays", "Same-Direction Pointers", "Move Zeroes", "Easy", 20, 82, 78, "meta,amazon,microsoft", "stable partition,write pointer,in-place", "Push all zeros to the end while keeping the order of the other values."],
  ["sort-colors", "arrays", "Dutch National Flag", "Sort Colors", "Medium", 25, 84, 88, "amazon,microsoft,meta", "three-way partition,one pass,in-place", "Sort an array containing only three distinct values in a single pass."],
  ["next-permutation", "arrays", "Lexicographic Order", "Next Permutation", "Medium", 30, 72, 80, "google,amazon,flipkart", "pivot scan,suffix reverse,in-place", "Rearrange numbers into the next larger arrangement, or the smallest if none exists."],
  ["majority-element", "arrays", "Boyer-Moore Voting", "Majority Element", "Easy", 20, 80, 85, "amazon,adobe,microsoft", "voting algorithm,counting,invariant", "Find the value appearing more than half the time using constant extra space."],
  ["majority-element-ii", "arrays", "Boyer-Moore Voting", "Majority Element II", "Medium", 30, 60, 78, "amazon,google", "generalised voting,two candidates,verification pass", "Find every value appearing more than a third of the time in linear time."],
  ["set-matrix-zeroes", "arrays", "Matrix In-Place Marking", "Set Matrix Zeroes", "Medium", 30, 78, 80, "amazon,microsoft,meta", "matrix traversal,first row as flags,in-place", "If a cell is zero, blank out its whole row and column, using the matrix itself as scratch space."],
  ["spiral-matrix", "arrays", "Matrix Boundary Walk", "Spiral Matrix", "Medium", 30, 82, 72, "microsoft,amazon,google,uber", "boundary pointers,matrix traversal,layer peeling", "Read a matrix in spiral order from the outside inward."],
  ["rotate-image", "arrays", "Transpose and Reverse", "Rotate Image", "Medium", 25, 76, 75, "amazon,microsoft,apple", "transpose,row reversal,in-place matrix", "Rotate a square matrix a quarter turn clockwise without extra storage."],
  ["pascals-triangle", "arrays", "Row Construction", "Pascal's Triangle", "Easy", 20, 60, 62, "amazon,adobe", "combinatorics,row recurrence", "Build the first n rows where each entry is the sum of the two above it."],
  ["plus-one", "arrays", "Carry Propagation", "Plus One", "Easy", 20, 62, 58, "google,amazon", "carry,digit arrays", "Add one to a number represented as an array of digits."],
  ["merge-sorted-array", "arrays", "Backward Merge", "Merge Sorted Array", "Easy", 20, 84, 82, "meta,amazon,microsoft", "two pointers,fill from the end,in-place merge", "Merge a second sorted array into the first one, which already has room at the end."],
  ["find-the-duplicate-number", "arrays", "Cyclic Detection", "Find the Duplicate Number", "Medium", 30, 74, 90, "amazon,google,microsoft", "floyd cycle,index as pointer,read-only constraint", "Find the one repeated value without modifying the array or using extra space."],
  ["first-missing-positive", "arrays", "Index as Hash", "First Missing Positive", "Hard", 40, 70, 92, "amazon,google,stripe", "cyclic placement,index marking,in-place hashing", "Find the smallest absent positive integer in linear time and constant space."],

  // ============================ HASHING ============================
  ["two-sum", "hashing", "Complement Lookup", "Two Sum", "Easy", 20, 99, 95, "amazon,google,meta,microsoft,adobe", "hash map,complement,one pass", "Find two indices whose values add to a target."],
  ["contains-duplicate", "hashing", "Set Membership", "Contains Duplicate", "Easy", 20, 85, 70, "amazon,google,apple", "hash set,duplicate detection", "Decide whether any value appears more than once."],
  ["valid-anagram", "hashing", "Frequency Map", "Valid Anagram", "Easy", 20, 86, 78, "amazon,meta,uber", "character counts,frequency map", "Decide whether two strings are rearrangements of each other."],
  ["group-anagrams", "hashing", "Canonical Key Grouping", "Group Anagrams", "Medium", 30, 90, 92, "amazon,meta,uber,microsoft", "hash grouping,canonical form,sorted key", "Bucket a list of words so that rearrangements of the same letters end up together."],
  ["subarray-sum-equals-k", "hashing", "Prefix Sum + Hash", "Subarray Sum Equals K", "Medium", 30, 88, 96, "meta,amazon,google,uber", "prefix sum,hash map,count subarrays", "Count contiguous blocks whose total equals a given number."],
  ["continuous-subarray-sum", "hashing", "Prefix Sum + Hash", "Continuous Subarray Good", "Medium", 30, 66, 85, "meta,amazon", "prefix modulo,pigeonhole,hash map", "Detect a block of at least two numbers whose total is a multiple of k."],
  ["subarray-sums-divisible-by-k", "hashing", "Prefix Sum + Hash", "Subarray Sums Divisible by K", "Medium", 30, 64, 86, "amazon,google", "prefix modulo,negative remainders,counting", "Count blocks whose total divides evenly by k."],
  ["longest-consecutive-sequence", "hashing", "Set Expansion", "Longest Consecutive Sequence", "Medium", 30, 84, 88, "google,amazon,meta", "hash set,sequence start detection,linear time", "Find the longest run of consecutive integers, ignoring their order in the array."],
  ["intersection-of-two-arrays-ii", "hashing", "Frequency Map", "Intersection of Two Arrays II", "Easy", 20, 70, 68, "meta,amazon", "counting,multiset intersection", "Return the shared values between two arrays, keeping duplicates."],
  ["isomorphic-strings", "hashing", "Bijective Mapping", "Isomorphic Strings", "Easy", 20, 68, 76, "amazon,linkedin,google", "two-way mapping,character substitution", "Decide whether one string can become another by consistently renaming characters."],
  ["word-pattern", "hashing", "Bijective Mapping", "Word Pattern", "Easy", 20, 62, 74, "amazon,microsoft", "two-way mapping,tokenising", "Check that a pattern of letters lines up one-to-one with a sequence of words."],
  ["4sum-ii", "hashing", "Meet in the Middle", "4Sum II", "Medium", 30, 58, 84, "amazon,google", "pair sums,hash map,quadratic from quartic", "Count quadruples across four arrays that sum to zero, faster than brute force."],
  ["ransom-note", "hashing", "Frequency Map", "Ransom Note", "Easy", 20, 66, 60, "amazon,apple", "character counts,availability check", "Decide whether one string can be built from the letters of another."],
  ["lru-cache", "hashing", "Hash Map + Doubly Linked List", "LRU Cache", "Medium", 35, 92, 94, "amazon,microsoft,meta,uber,google", "hash map,doubly linked list,design,O(1) eviction", "Design a fixed-size cache that evicts whichever key was used least recently."],

  // ============================ STRINGS ============================
  ["longest-palindromic-substring", "strings", "Expand Around Center", "Longest Palindromic Substring", "Medium", 30, 88, 88, "amazon,microsoft,adobe,meta", "expand from center,odd and even cases", "Find the longest stretch of a string that reads the same both ways."],
  ["palindromic-substrings", "strings", "Expand Around Center", "Palindromic Substrings", "Medium", 25, 70, 82, "amazon,adobe", "expand from center,counting", "Count how many substrings are palindromes."],
  ["longest-common-prefix", "strings", "Vertical Scan", "Longest Common Prefix", "Easy", 20, 72, 60, "amazon,adobe,microsoft", "character-wise comparison,early exit", "Find the longest starting segment shared by every string in a list."],
  ["string-to-integer-atoi", "strings", "Manual Parsing", "String to Integer (atoi)", "Medium", 30, 68, 62, "amazon,microsoft,adobe", "edge cases,overflow,whitespace handling", "Parse a leading integer out of messy text, handling signs, spaces, and overflow."],
  ["reverse-words-in-a-string", "strings", "Tokenise and Rebuild", "Reverse Words in a String", "Medium", 25, 74, 65, "amazon,microsoft,flipkart", "splitting,trimming,in-place reversal", "Reverse the order of words while collapsing extra spaces."],
  ["encode-and-decode-strings", "strings", "Length Prefixing", "Encode and Decode Strings", "Medium", 25, 62, 80, "google,amazon", "serialisation,delimiter safety,length header", "Design a way to pack a list of arbitrary strings into one string and recover it exactly."],
  ["find-the-index-of-the-first-occurrence-in-a-string", "strings", "Substring Search", "Find the Index of the First Occurrence", "Easy", 20, 70, 72, "amazon,microsoft", "naive search,KMP intuition,pattern matching", "Locate the first position where one string appears inside another."],
  ["multiply-strings", "strings", "Grade-School Multiplication", "Multiply Strings", "Medium", 35, 58, 66, "meta,amazon,microsoft", "digit arrays,carry,positional math", "Multiply two numbers given as strings without converting them to integers."],
  ["add-binary", "strings", "Carry Propagation", "Add Binary", "Easy", 20, 66, 60, "meta,amazon", "binary addition,carry,two pointers", "Add two binary numbers given as strings."],
  ["roman-to-integer", "strings", "Lookahead Rule", "Roman to Integer", "Easy", 20, 74, 58, "amazon,microsoft,adobe", "symbol table,subtractive notation", "Convert a Roman numeral into its numeric value."],
  ["sort-characters-by-frequency", "strings", "Frequency + Bucket Sort", "Sort Characters By Frequency", "Medium", 25, 66, 76, "amazon,google", "frequency map,bucket sort,heap alternative", "Reorder a string so the most frequent characters come first."],
  ["string-compression", "strings", "Run-Length Encoding", "String Compression", "Medium", 25, 64, 70, "amazon,microsoft", "in-place write pointer,run length,two pointers", "Compress repeated runs of characters in place and return the new length."],

  // ============================ TWO POINTERS ============================
  ["valid-palindrome", "two-pointers", "Opposite-Direction Pointers", "Valid Palindrome", "Easy", 20, 88, 80, "meta,amazon,microsoft", "two pointers,filtering,case folding", "Decide whether a string reads the same both ways, ignoring punctuation and case."],
  ["valid-palindrome-ii", "two-pointers", "Opposite-Direction Pointers", "Valid Palindrome II", "Easy", 20, 74, 82, "meta,amazon", "two pointers,single deletion,branching check", "Decide whether a string becomes a palindrome after deleting at most one character."],
  ["two-sum-ii-input-array-is-sorted", "two-pointers", "Opposite-Direction Pointers", "Two Sum II - Sorted Array", "Medium", 20, 82, 90, "amazon,google", "sorted array,converging pointers", "Find two values in a sorted array that add to a target using constant space."],
  ["3sum", "two-pointers", "Sort + Two Pointers", "3Sum", "Medium", 35, 95, 96, "amazon,meta,google,microsoft,adobe", "sorting,duplicate skipping,converging pointers", "Find all distinct triples that add to zero."],
  ["3sum-closest", "two-pointers", "Sort + Two Pointers", "3Sum Closest", "Medium", 30, 68, 82, "amazon,google", "sorting,best-so-far tracking", "Find the triple whose sum lands nearest a target."],
  ["4sum", "two-pointers", "Sort + Two Pointers", "4Sum", "Medium", 35, 60, 80, "amazon,adobe", "nested reduction,duplicate skipping,overflow", "Find all distinct quadruples summing to a target."],
  ["container-with-most-water", "two-pointers", "Opposite-Direction Pointers", "Container With Most Water", "Medium", 25, 90, 90, "amazon,meta,google,adobe", "greedy pointer move,area maximisation", "Pick two lines that, with the x-axis, hold the most water."],
  ["trapping-rain-water", "two-pointers", "Prefix Max + Two Pointers", "Trapping Rain Water", "Hard", 40, 90, 94, "amazon,google,meta,goldman-sachs", "prefix maxima,two pointers,stack alternative", "Compute how much water collects between bars of varying heights."],
  ["remove-duplicates-from-sorted-array", "two-pointers", "Same-Direction Pointers", "Remove Duplicates from Sorted Array", "Easy", 20, 78, 76, "meta,amazon,microsoft", "write pointer,in-place compaction", "Compact a sorted array in place so each value appears once."],
  ["squares-of-a-sorted-array", "two-pointers", "Opposite-Direction Pointers", "Squares of a Sorted Array", "Easy", 20, 72, 80, "meta,amazon", "sorted output,negative handling,fill from the end", "Return the sorted squares of a sorted array in linear time."],
  ["reverse-string", "two-pointers", "Opposite-Direction Pointers", "Reverse String", "Easy", 20, 58, 55, "amazon,apple", "in-place swap,two pointers", "Reverse a character array in place."],
  ["boats-to-save-people", "two-pointers", "Greedy Pairing", "Boats to Save People", "Medium", 25, 62, 80, "amazon,google", "sorting,greedy pairing,capacity constraint", "Pair the heaviest with the lightest person to use the fewest boats."],

  // ============================ SLIDING WINDOW ============================
  ["maximum-average-subarray-i", "sliding-window", "Fixed Window", "Maximum Average Subarray I", "Easy", 20, 70, 82, "amazon,google", "fixed window,running sum", "Find the highest average over any window of exactly k elements."],
  ["longest-substring-without-repeating-characters", "sliding-window", "Variable Window", "Longest Substring Without Repeating Characters", "Medium", 30, 97, 98, "amazon,google,meta,microsoft,adobe,uber", "variable window,hash set,shrink on violation", "Find the longest stretch of a string with no repeated character."],
  ["longest-repeating-character-replacement", "sliding-window", "Variable Window + Frequency", "Longest Repeating Character Replacement", "Medium", 30, 82, 94, "google,amazon,meta", "window frequency,max count invariant,k replacements", "Find the longest run you can make uniform by changing at most k characters."],
  ["permutation-in-string", "sliding-window", "Fixed Window + Frequency", "Permutation in String", "Medium", 25, 80, 90, "microsoft,amazon,meta", "frequency match,fixed window,counter comparison", "Decide whether any rearrangement of one string appears inside another."],
  ["find-all-anagrams-in-a-string", "sliding-window", "Fixed Window + Frequency", "Find All Anagrams in a String", "Medium", 25, 80, 90, "amazon,meta,uber", "frequency match,window slide,index collection", "Find every starting position where a rearrangement of one string appears in another."],
  ["minimum-window-substring", "sliding-window", "Variable Window + Frequency", "Minimum Window Substring", "Hard", 40, 88, 96, "meta,amazon,uber,linkedin", "need and have counters,shrink phase,two pointers", "Find the shortest stretch of a string containing all characters of another, counts included."],
  ["max-consecutive-ones-iii", "sliding-window", "Variable Window", "Max Consecutive Ones III", "Medium", 25, 74, 90, "amazon,google", "window with budget,flip counter", "Find the longest run of ones if you may flip at most k zeros."],
  ["fruit-into-baskets", "sliding-window", "Variable Window + Distinct Count", "Fruit Into Baskets", "Medium", 25, 66, 88, "google,amazon", "at most k distinct,window map", "Find the longest stretch containing at most two distinct values."],
  ["subarray-product-less-than-k", "sliding-window", "Variable Window (Product)", "Subarray Product Less Than K", "Medium", 30, 62, 84, "amazon,google", "multiplicative window,counting subarrays", "Count contiguous blocks whose product stays under a limit."],
  ["minimum-size-subarray-sum", "sliding-window", "Variable Window (Shortest)", "Minimum Size Subarray Sum", "Medium", 25, 80, 92, "amazon,google,meta", "shortest window,shrink while valid", "Find the shortest block whose total reaches a target."],
  ["longest-subarray-of-1s-after-deleting-one-element", "sliding-window", "Variable Window", "Longest Subarray of 1s After Deleting One", "Medium", 25, 60, 84, "amazon,google", "window with one deletion,zero budget", "Find the longest run of ones after removing exactly one element."],
  ["count-number-of-nice-subarrays", "sliding-window", "At Most K Trick", "Count Number of Nice Subarrays", "Medium", 30, 58, 88, "amazon,google", "at most k minus at most k-1,counting technique", "Count blocks containing exactly k odd numbers."],

  // ============================ BINARY SEARCH ============================
  ["binary-search", "binary-search", "Standard Binary Search", "Binary Search", "Easy", 20, 88, 90, "amazon,google,microsoft", "sorted array,invariant,midpoint", "Locate a value in a sorted array in logarithmic time."],
  ["search-insert-position", "binary-search", "Lower Bound", "Search Insert Position", "Easy", 20, 76, 86, "amazon,microsoft", "lower bound,insertion index", "Find where a value belongs in a sorted array."],
  ["first-bad-version", "binary-search", "Predicate Binary Search", "First Bad Version", "Easy", 20, 74, 88, "meta,google,amazon", "monotone predicate,boundary search,API calls", "Find the first version where a monotone check starts failing."],
  ["find-first-and-last-position-of-element-in-sorted-array", "binary-search", "Boundary Search", "Find First and Last Position", "Medium", 25, 84, 92, "amazon,meta,linkedin", "lower bound,upper bound,duplicate ranges", "Find the first and last index of a value in a sorted array with duplicates."],
  ["search-in-rotated-sorted-array", "binary-search", "Rotated Array Search", "Search in Rotated Sorted Array", "Medium", 30, 90, 92, "amazon,meta,microsoft,uber", "pivot detection,half-sorted reasoning", "Search a sorted array that has been rotated at an unknown point."],
  ["search-in-rotated-sorted-array-ii", "binary-search", "Rotated Array Search", "Search in Rotated Sorted Array II", "Medium", 30, 62, 82, "amazon,google", "duplicates,worst-case degradation", "Search a rotated sorted array that may contain duplicates."],
  ["find-minimum-in-rotated-sorted-array", "binary-search", "Rotated Array Search", "Find Minimum in Rotated Sorted Array", "Medium", 25, 82, 88, "amazon,microsoft,goldman-sachs", "pivot detection,comparison with right end", "Find the smallest value in a rotated sorted array."],
  ["search-a-2d-matrix", "binary-search", "Flattened Matrix Search", "Search a 2D Matrix", "Medium", 25, 76, 84, "amazon,microsoft", "index flattening,row-major order", "Search a row-sorted matrix as if it were one long sorted array."],
  ["find-peak-element", "binary-search", "Slope Binary Search", "Find Peak Element", "Medium", 25, 70, 86, "google,meta,amazon", "local maximum,slope direction", "Find any element larger than both neighbours in logarithmic time."],
  ["sqrtx", "binary-search", "Answer-Space Binary Search", "Sqrt(x)", "Easy", 20, 68, 82, "amazon,microsoft,adobe", "integer square root,answer search,overflow", "Compute an integer square root without a math library."],
  ["koko-eating-bananas", "binary-search", "Answer-Space Binary Search", "Koko Eating Bananas", "Medium", 30, 84, 96, "amazon,google,doordash", "binary search on answer,feasibility check", "Find the smallest hourly rate that finishes the work within a deadline."],
  ["capacity-to-ship-packages-within-d-days", "binary-search", "Answer-Space Binary Search", "Capacity to Ship Packages Within D Days", "Medium", 30, 80, 96, "amazon,doordash,uber", "binary search on answer,greedy simulation", "Find the smallest ship capacity that clears the queue in the allowed days."],
  ["split-array-largest-sum", "binary-search", "Answer-Space Binary Search", "Split Array Largest Sum", "Hard", 40, 62, 92, "google,amazon", "minimise the maximum,feasibility check,partitioning", "Split an array into k parts so the biggest part total is as small as possible."],
  ["median-of-two-sorted-arrays", "binary-search", "Partition Binary Search", "Median of Two Sorted Arrays", "Hard", 40, 74, 88, "amazon,google,microsoft,adobe", "partition search,median definition,edge sentinels", "Find the median of two sorted arrays in logarithmic time."],

  // ============================ SORTING ============================
  ["sort-an-array", "sorting", "Merge Sort", "Sort an Array", "Medium", 30, 68, 88, "amazon,microsoft", "merge sort,divide and conquer,stability", "Implement an efficient sort yourself rather than calling the built-in."],
  ["largest-number", "sorting", "Custom Comparator", "Largest Number", "Medium", 30, 72, 88, "amazon,google,microsoft", "comparator design,string concatenation ordering", "Order numbers so their concatenation forms the largest possible value."],
  ["h-index", "sorting", "Counting Sort", "H-Index", "Medium", 25, 60, 74, "google,amazon", "sorting,counting buckets,threshold search", "Compute the largest h such that h items each have a count of at least h."],
  ["relative-sort-array", "sorting", "Custom Key Sort", "Relative Sort Array", "Easy", 20, 56, 66, "amazon,adobe", "custom key,rank map,counting sort", "Sort one array to match the order dictated by another, leaving extras at the end."],
  ["custom-sort-string", "sorting", "Custom Key Sort", "Custom Sort String", "Medium", 25, 58, 70, "meta,amazon", "rank map,stable ordering,frequency counting", "Reorder a string to follow a supplied character priority."],
  ["count-of-smaller-numbers-after-self", "sorting", "Merge Sort Counting", "Count of Smaller Numbers After Self", "Hard", 40, 55, 88, "google,amazon", "merge sort,inversion counting,index tracking", "For each position, count how many later values are smaller."],

  // ============================ STACK ============================
  ["valid-parentheses", "stack", "Bracket Matching", "Valid Parentheses", "Easy", 20, 94, 88, "amazon,google,meta,microsoft", "stack,matching pairs,early exit", "Decide whether a string of brackets is properly nested and closed."],
  ["min-stack", "stack", "Auxiliary Stack", "Min Stack", "Medium", 25, 84, 88, "amazon,google,uber,goldman-sachs", "design,paired stack,constant-time minimum", "Design a stack that also reports its smallest element in constant time."],
  ["evaluate-reverse-polish-notation", "stack", "Expression Evaluation", "Evaluate Reverse Polish Notation", "Medium", 25, 76, 84, "amazon,linkedin,meta", "postfix evaluation,operand stack", "Evaluate an expression written in postfix notation."],
  ["basic-calculator-ii", "stack", "Expression Evaluation", "Basic Calculator II", "Medium", 35, 74, 86, "amazon,google,microsoft", "operator precedence,stack,parsing", "Evaluate an infix expression with plus, minus, times, and divide but no brackets."],
  ["daily-temperatures", "stack", "Monotonic Stack", "Daily Temperatures", "Medium", 30, 86, 96, "amazon,google,meta", "monotonic decreasing stack,next greater,index stack", "For each day, find how long until a warmer day arrives."],
  ["next-greater-element-i", "stack", "Monotonic Stack", "Next Greater Element I", "Easy", 20, 74, 92, "amazon,meta", "monotonic stack,hash lookup,next greater", "For each queried value, find the next larger value to its right."],
  ["next-greater-element-ii", "stack", "Monotonic Stack (Circular)", "Next Greater Element II", "Medium", 25, 64, 88, "amazon,google", "circular array,double pass,monotonic stack", "Solve the next-greater problem on a circular array."],
  ["largest-rectangle-in-histogram", "stack", "Monotonic Stack", "Largest Rectangle in Histogram", "Hard", 40, 78, 96, "amazon,google,microsoft", "monotonic stack,previous and next smaller,area maximisation", "Find the biggest rectangle that fits under a histogram."],
  ["car-fleet", "stack", "Monotonic Stack", "Car Fleet", "Medium", 30, 58, 82, "google,amazon", "sorting by position,arrival times,stack merging", "Count how many groups form when faster vehicles bunch behind slower ones."],
  ["asteroid-collision", "stack", "Simulation Stack", "Asteroid Collision", "Medium", 30, 70, 82, "amazon,meta,uber", "stack simulation,collision rules,sign handling", "Simulate collisions between objects moving in opposite directions."],
  ["remove-k-digits", "stack", "Monotonic Stack (Greedy)", "Remove K Digits", "Medium", 30, 62, 86, "google,amazon", "greedy removal,monotonic increasing stack,leading zeros", "Delete k digits to leave the smallest possible number."],
  ["simplify-path", "stack", "Path Normalisation", "Simplify Path", "Medium", 25, 66, 70, "meta,amazon,microsoft", "tokenising,stack,relative path rules", "Reduce a Unix-style path to its canonical form."],

  // ============================ QUEUE / DEQUE ============================
  ["sliding-window-maximum", "queue-deque", "Monotonic Deque", "Sliding Window Maximum", "Hard", 40, 86, 96, "amazon,google,meta,uber", "monotonic deque,window maximum,index eviction", "Report the largest value in each window of k elements."],
  ["shortest-subarray-with-sum-at-least-k", "queue-deque", "Monotonic Deque + Prefix Sum", "Shortest Subarray with Sum at Least K", "Hard", 40, 55, 90, "google,amazon", "prefix sums,monotonic deque,negative values", "Find the shortest block reaching a target sum when negatives are allowed."],
  ["implement-queue-using-stacks", "queue-deque", "Amortised Two-Stack Queue", "Implement Queue using Stacks", "Easy", 20, 70, 80, "amazon,microsoft,meta", "design,amortised analysis,two stacks", "Build a queue whose only primitive is a stack."],
  ["number-of-recent-calls", "queue-deque", "Sliding Time Window", "Number of Recent Calls", "Easy", 20, 58, 74, "amazon,google", "queue,expiry window,streaming", "Count events that arrived within the last few seconds."],
  ["moving-average-from-data-stream", "queue-deque", "Fixed Window Queue", "Moving Average from Data Stream", "Easy", 20, 62, 78, "amazon,uber,google", "streaming,fixed window,running sum", "Maintain a rolling average over the last k readings."],

  // ============================ LINKED LIST ============================
  ["reverse-linked-list", "linked-list", "Iterative Reversal", "Reverse Linked List", "Easy", 20, 95, 92, "amazon,microsoft,meta,adobe", "pointer rewiring,iterative and recursive", "Reverse the direction of a singly linked list."],
  ["middle-of-the-linked-list", "linked-list", "Fast and Slow Pointers", "Middle of the Linked List", "Easy", 20, 78, 88, "amazon,meta", "two-speed pointers,midpoint", "Find the middle node in one pass."],
  ["linked-list-cycle", "linked-list", "Fast and Slow Pointers", "Linked List Cycle", "Easy", 20, 88, 92, "amazon,microsoft,meta", "floyd cycle detection,two-speed pointers", "Detect whether a list loops back on itself."],
  ["linked-list-cycle-ii", "linked-list", "Fast and Slow Pointers", "Linked List Cycle II", "Medium", 30, 72, 90, "amazon,google", "cycle entry point,floyd phase two,pointer math", "Find the exact node where a loop begins."],
  ["merge-two-sorted-lists", "linked-list", "Merge with Dummy Head", "Merge Two Sorted Lists", "Easy", 20, 88, 88, "amazon,microsoft,apple,adobe", "dummy node,merge,pointer splicing", "Merge two sorted lists into one sorted list."],
  ["remove-nth-node-from-end-of-list", "linked-list", "Gap Two Pointers", "Remove Nth Node From End of List", "Medium", 25, 82, 88, "amazon,meta,microsoft", "offset pointers,dummy node,one pass", "Delete the nth node counted from the end in a single pass."],
  ["intersection-of-two-linked-lists", "linked-list", "Pointer Switching", "Intersection of Two Linked Lists", "Easy", 20, 74, 86, "amazon,microsoft,meta", "length alignment,pointer switch trick", "Find the node where two lists join."],
  ["palindrome-linked-list", "linked-list", "Reverse Half", "Palindrome Linked List", "Easy", 25, 76, 88, "amazon,meta,microsoft", "midpoint,in-place reversal,comparison", "Decide whether a list reads the same forwards and backwards using constant space."],
  ["add-two-numbers", "linked-list", "Digit-wise Carry", "Add Two Numbers", "Medium", 25, 88, 82, "amazon,microsoft,meta,adobe", "carry,dummy node,unequal lengths", "Add two numbers whose digits are stored as linked lists."],
  ["reorder-list", "linked-list", "Split, Reverse, Merge", "Reorder List", "Medium", 30, 74, 90, "amazon,meta,microsoft", "midpoint split,reversal,alternate merge", "Weave the second half of a list backwards into the first half."],
  ["reverse-nodes-in-k-group", "linked-list", "Group Reversal", "Reverse Nodes in k-Group", "Hard", 40, 70, 90, "amazon,microsoft,google", "segment reversal,pointer bookkeeping,recursion", "Reverse the list in fixed-size chunks, leaving any short tail alone."],
  ["copy-list-with-random-pointer", "linked-list", "Interleaved Cloning", "Copy List with Random Pointer", "Medium", 30, 72, 86, "amazon,meta,microsoft", "deep copy,hash map or interleaving,pointer mapping", "Deep-copy a list where each node also points at an arbitrary other node."],
  ["sort-list", "linked-list", "Merge Sort on Lists", "Sort List", "Medium", 35, 66, 86, "amazon,google,microsoft", "merge sort,midpoint split,constant space", "Sort a linked list in logarithmic extra space."],

  // ============================ TREES ============================
  ["maximum-depth-of-binary-tree", "trees", "DFS Recursion", "Maximum Depth of Binary Tree", "Easy", 20, 88, 88, "amazon,meta,microsoft", "recursion,height,post-order", "Compute the height of a binary tree."],
  ["same-tree", "trees", "Parallel DFS", "Same Tree", "Easy", 20, 74, 82, "amazon,meta", "structural comparison,recursion", "Decide whether two trees are structurally identical with equal values."],
  ["subtree-of-another-tree", "trees", "Parallel DFS", "Subtree of Another Tree", "Easy", 25, 70, 84, "amazon,meta", "tree matching,recursion,serialisation alternative", "Decide whether one tree appears intact somewhere inside another."],
  ["invert-binary-tree", "trees", "DFS Recursion", "Invert Binary Tree", "Easy", 20, 82, 78, "google,amazon,meta", "recursion,child swap", "Mirror a binary tree left to right."],
  ["balanced-binary-tree", "trees", "Bottom-Up DFS", "Balanced Binary Tree", "Easy", 25, 72, 86, "amazon,google", "height computation,early termination,post-order", "Decide whether every node has subtrees within one level of each other."],
  ["diameter-of-binary-tree", "trees", "Bottom-Up DFS", "Diameter of Binary Tree", "Easy", 25, 82, 90, "meta,amazon,google", "height plus global answer,post-order", "Find the longest path between any two nodes."],
  ["binary-tree-level-order-traversal", "trees", "BFS", "Binary Tree Level Order Traversal", "Medium", 25, 90, 92, "amazon,meta,microsoft,linkedin", "queue,level batching,BFS", "List node values one level at a time."],
  ["binary-tree-right-side-view", "trees", "BFS", "Binary Tree Right Side View", "Medium", 25, 80, 88, "meta,amazon,microsoft", "level BFS,last node per level", "Report what you would see looking at the tree from the right."],
  ["binary-tree-maximum-path-sum", "trees", "Bottom-Up DFS", "Binary Tree Maximum Path Sum", "Hard", 40, 78, 92, "amazon,meta,microsoft", "post-order,global maximum,negative pruning", "Find the highest-scoring path that may bend at one node."],
  ["path-sum-ii", "trees", "DFS Backtracking", "Path Sum II", "Medium", 25, 68, 84, "amazon,meta", "root-to-leaf paths,backtracking,accumulator", "Collect every root-to-leaf path adding to a target."],
  ["lowest-common-ancestor-of-a-binary-search-tree", "trees", "BST Property Walk", "Lowest Common Ancestor of a BST", "Medium", 20, 78, 84, "amazon,meta,microsoft", "BST ordering,split point,iteration", "Find the deepest shared ancestor of two nodes in a search tree."],
  ["lowest-common-ancestor-of-a-binary-tree", "trees", "Post-order LCA", "Lowest Common Ancestor of a Binary Tree", "Medium", 30, 84, 92, "meta,amazon,microsoft,linkedin", "post-order,found-flag propagation,recursion", "Find the deepest shared ancestor in a tree with no ordering guarantee."],
  ["validate-binary-search-tree", "trees", "Range Propagation", "Validate Binary Search Tree", "Medium", 30, 88, 92, "amazon,meta,microsoft,adobe", "min-max bounds,in-order check,recursion", "Verify a tree satisfies the search-tree ordering everywhere, not just locally."],
  ["kth-smallest-element-in-a-bst", "trees", "In-order Traversal", "Kth Smallest Element in a BST", "Medium", 25, 78, 88, "amazon,google,uber", "in-order traversal,counter,early stop", "Find the kth smallest value in a search tree."],
  ["construct-binary-tree-from-preorder-and-inorder-traversal", "trees", "Traversal Reconstruction", "Construct Binary Tree from Preorder and Inorder", "Medium", 35, 74, 88, "amazon,microsoft,meta", "index map,recursion,traversal semantics", "Rebuild a tree from its preorder and inorder listings."],
  ["serialize-and-deserialize-binary-tree", "trees", "Traversal Serialisation", "Serialize and Deserialize Binary Tree", "Hard", 40, 76, 88, "amazon,meta,google,linkedin", "preorder with null markers,design,parsing", "Turn a tree into a string and rebuild it exactly."],

  // ============================ GRAPHS ============================
  ["number-of-islands", "graphs", "Grid DFS/BFS", "Number of Islands", "Medium", 30, 96, 96, "amazon,google,meta,microsoft,uber", "grid traversal,connected components,visited marking", "Count separate landmasses in a grid of land and water cells."],
  ["max-area-of-island", "graphs", "Grid DFS", "Max Area of Island", "Medium", 25, 74, 88, "amazon,google", "flood fill,area accumulation", "Find the largest connected landmass in a grid."],
  ["clone-graph", "graphs", "DFS with Memo", "Clone Graph", "Medium", 30, 78, 88, "meta,amazon,google", "deep copy,visited map,recursion", "Deep-copy a graph without duplicating shared nodes."],
  ["rotting-oranges", "graphs", "Multi-source BFS", "Rotting Oranges", "Medium", 30, 84, 94, "amazon,microsoft,google", "multi-source BFS,level counting,grid", "Find how long a spreading process takes to reach every reachable cell."],
  ["walls-and-gates", "graphs", "Multi-source BFS", "Walls and Gates", "Medium", 30, 62, 90, "meta,google,amazon", "multi-source BFS,distance fill,grid", "Fill each open cell with its distance to the nearest gate."],
  ["pacific-atlantic-water-flow", "graphs", "Reverse Flood Fill", "Pacific Atlantic Water Flow", "Medium", 35, 70, 88, "amazon,google", "reverse traversal,two visited sets,grid DFS", "Find cells that can drain to both edges of a height map."],
  ["surrounded-regions", "graphs", "Boundary Flood Fill", "Surrounded Regions", "Medium", 30, 68, 84, "amazon,microsoft", "border seeding,flood fill,in-place marking", "Capture regions that do not touch the border."],
  ["course-schedule", "graphs", "Topological Sort", "Course Schedule", "Medium", 30, 90, 94, "amazon,google,meta,microsoft", "cycle detection,indegree,Kahn algorithm", "Decide whether a set of prerequisites can be completed at all."],
  ["course-schedule-ii", "graphs", "Topological Sort", "Course Schedule II", "Medium", 30, 82, 92, "amazon,google,microsoft", "topological order,indegree queue", "Produce a valid ordering that respects all prerequisites."],
  ["alien-dictionary", "graphs", "Topological Sort", "Alien Dictionary", "Hard", 40, 66, 90, "amazon,google,airbnb", "order inference,graph building,cycle detection", "Infer a character ordering from a list of words sorted in an unknown alphabet."],
  ["number-of-connected-components-in-an-undirected-graph", "graphs", "Union Find", "Number of Connected Components", "Medium", 25, 72, 92, "amazon,google", "union find,path compression,components", "Count separate groups in an undirected graph."],
  ["graph-valid-tree", "graphs", "Union Find", "Graph Valid Tree", "Medium", 25, 66, 88, "google,meta,amazon", "cycle detection,edge count invariant,union find", "Decide whether a graph is a single tree with no cycles."],
  ["redundant-connection", "graphs", "Union Find", "Redundant Connection", "Medium", 25, 64, 88, "google,amazon", "union find,first cycle edge", "Find the edge whose removal restores a tree."],
  ["network-delay-time", "graphs", "Dijkstra", "Network Delay Time", "Medium", 35, 70, 92, "amazon,google,uber", "dijkstra,priority queue,shortest path", "Find how long a signal takes to reach every node in a weighted graph."],
  ["cheapest-flights-within-k-stops", "graphs", "Bellman-Ford", "Cheapest Flights Within K Stops", "Medium", 35, 68, 90, "amazon,google,uber", "bellman-ford,bounded relaxation,layered BFS", "Find the cheapest route under a limit on the number of hops."],
  ["word-ladder", "graphs", "BFS on Implicit Graph", "Word Ladder", "Hard", 40, 70, 90, "amazon,google,meta", "implicit graph,BFS levels,neighbour generation", "Find the fewest single-character edits turning one word into another."],

  // ============================ HEAP ============================
  ["kth-largest-element-in-an-array", "heap", "Top-K Heap", "Kth Largest Element in an Array", "Medium", 25, 88, 92, "amazon,meta,microsoft,goldman-sachs", "min-heap of size k,quickselect alternative", "Find the kth largest value without fully sorting."],
  ["top-k-frequent-elements", "heap", "Frequency + Top-K", "Top K Frequent Elements", "Medium", 30, 90, 94, "amazon,meta,uber,microsoft", "frequency map,heap,bucket sort", "Return the k most common values."],
  ["k-closest-points-to-origin", "heap", "Top-K Heap", "K Closest Points to Origin", "Medium", 25, 82, 90, "amazon,meta,uber,linkedin", "max-heap of size k,distance comparison", "Find the k points nearest the origin."],
  ["merge-k-sorted-lists", "heap", "K-Way Merge", "Merge k Sorted Lists", "Hard", 40, 88, 94, "amazon,meta,google,microsoft", "k-way merge,priority queue,divide and conquer", "Merge many sorted lists into one."],
  ["find-median-from-data-stream", "heap", "Two Heaps", "Find Median from Data Stream", "Hard", 40, 84, 96, "amazon,google,meta,uber", "two heaps,balance invariant,streaming median", "Maintain the running median of a stream of numbers."],
  ["task-scheduler", "heap", "Greedy Scheduling", "Task Scheduler", "Medium", 30, 76, 88, "amazon,meta,uber", "frequency counting,cooldown,greedy formula", "Find the shortest schedule when identical tasks need a cooldown gap."],
  ["last-stone-weight", "heap", "Max Heap Simulation", "Last Stone Weight", "Easy", 20, 62, 74, "amazon,google", "max-heap,simulation", "Repeatedly smash the two largest values together and report what remains."],
  ["kth-largest-element-in-a-stream", "heap", "Streaming Top-K", "Kth Largest Element in a Stream", "Easy", 20, 66, 82, "amazon,google", "min-heap of size k,design,streaming", "Design a structure reporting the kth largest value as new numbers arrive."],
  ["reorganize-string", "heap", "Greedy + Heap", "Reorganize String", "Medium", 30, 64, 84, "amazon,google,meta", "frequency heap,alternate placement,feasibility", "Rearrange a string so no two neighbours match."],
  ["minimum-cost-to-connect-sticks", "heap", "Greedy + Heap", "Minimum Cost to Connect Sticks", "Medium", 25, 58, 82, "amazon,google", "huffman-style greedy,min-heap", "Combine items two at a time at minimum total cost."],

  // ============================ BACKTRACKING ============================
  ["subsets", "backtracking", "Subset Generation", "Subsets", "Medium", 25, 88, 94, "amazon,meta,google", "include-exclude recursion,power set,bitmask alternative", "Generate every subset of a set of distinct values."],
  ["subsets-ii", "backtracking", "Subset Generation with Dedup", "Subsets II", "Medium", 30, 70, 90, "amazon,meta", "sorting,duplicate skipping,recursion", "Generate every distinct subset when duplicates are present."],
  ["permutations", "backtracking", "Permutation Generation", "Permutations", "Medium", 25, 84, 92, "amazon,microsoft,meta", "swap or used-array,recursion tree", "Generate every ordering of distinct values."],
  ["permutations-ii", "backtracking", "Permutation with Dedup", "Permutations II", "Medium", 30, 62, 86, "amazon,microsoft", "sorting,sibling deduplication", "Generate every distinct ordering when values repeat."],
  ["combination-sum", "backtracking", "Combination with Reuse", "Combination Sum", "Medium", 30, 84, 92, "amazon,meta,uber", "unbounded reuse,pruning,recursion", "Find all combinations summing to a target where numbers may repeat."],
  ["combination-sum-ii", "backtracking", "Combination with Dedup", "Combination Sum II", "Medium", 30, 68, 88, "amazon,meta", "each element once,duplicate skipping,sorting", "Find all distinct combinations summing to a target using each item once."],
  ["letter-combinations-of-a-phone-number", "backtracking", "Cartesian Product", "Letter Combinations of a Phone Number", "Medium", 25, 80, 84, "amazon,meta,google,uber", "mapping,recursion,product enumeration", "List every string a sequence of keypad digits could spell."],
  ["generate-parentheses", "backtracking", "Constrained Generation", "Generate Parentheses", "Medium", 25, 84, 90, "amazon,google,meta,adobe", "validity invariant,pruning,recursion", "Generate all well-formed bracket strings of a given size."],
  ["word-search", "backtracking", "Grid Backtracking", "Word Search", "Medium", 35, 84, 92, "amazon,microsoft,meta", "grid DFS,visited marking,backtrack restore", "Decide whether a word can be traced through adjacent grid cells."],
  ["palindrome-partitioning", "backtracking", "Partition Backtracking", "Palindrome Partitioning", "Medium", 35, 66, 88, "amazon,google", "prefix checks,recursion,partitioning", "Split a string every way such that each piece is a palindrome."],
  ["n-queens", "backtracking", "Constraint Backtracking", "N-Queens", "Hard", 40, 66, 90, "amazon,google,adobe", "conflict sets,diagonal indexing,pruning", "Place n queens on a board so none attack another."],

  // ============================ GREEDY ============================
  ["jump-game", "greedy", "Reachability Greedy", "Jump Game", "Medium", 25, 84, 90, "amazon,meta,microsoft", "furthest reach,greedy invariant", "Decide whether you can reach the end when each cell caps your jump length."],
  ["jump-game-ii", "greedy", "Interval Greedy", "Jump Game II", "Medium", 30, 74, 90, "amazon,google,meta", "level-by-level reach,BFS-like greedy", "Reach the end in the fewest jumps."],
  ["gas-station", "greedy", "Running Deficit", "Gas Station", "Medium", 30, 78, 88, "amazon,google,uber", "total feasibility,restart point,running balance", "Find the starting station from which you can complete a full circuit."],
  ["partition-labels", "greedy", "Last-Occurrence Sweep", "Partition Labels", "Medium", 25, 74, 88, "amazon,meta,google", "last index map,interval merge,greedy cut", "Split a string so each character lives in exactly one piece, maximising the number of pieces."],
  ["assign-cookies", "greedy", "Sorted Matching", "Assign Cookies", "Easy", 20, 54, 70, "amazon", "sorting,greedy pairing", "Match supply to demand so the greatest number of requests are satisfied."],
  ["hand-of-straights", "greedy", "Group Formation", "Hand of Straights", "Medium", 30, 60, 82, "google,amazon", "counting map,sequential consumption,greedy", "Decide whether cards can be split entirely into consecutive runs of a fixed size."],
  ["valid-parenthesis-string", "greedy", "Range Tracking", "Valid Parenthesis String", "Medium", 30, 62, 86, "meta,amazon,google", "open count range,wildcard handling,greedy bounds", "Validate a bracket string where some characters may act as either bracket or nothing."],
  ["best-time-to-buy-and-sell-stock-ii", "greedy", "Local Gain Accumulation", "Best Time to Buy and Sell Stock II", "Medium", 20, 76, 78, "amazon,goldman-sachs,microsoft", "greedy sum of increases,unlimited trades", "Take unlimited trades and collect the maximum total profit."],
  ["candy", "greedy", "Two-Pass Sweep", "Candy", "Hard", 35, 58, 84, "amazon,google,flipkart", "left pass,right pass,local constraints", "Hand out the fewest items while respecting neighbour comparison rules."],

  // ============================ DYNAMIC PROGRAMMING ============================
  ["climbing-stairs", "dp", "1D DP", "Climbing Stairs", "Easy", 20, 88, 88, "amazon,adobe,google", "fibonacci recurrence,bottom-up,rolling variables", "Count the ways to climb n steps taking one or two at a time."],
  ["min-cost-climbing-stairs", "dp", "1D DP", "Min Cost Climbing Stairs", "Easy", 20, 70, 84, "amazon,microsoft", "cost recurrence,rolling state", "Reach the top of a staircase at minimum total cost."],
  ["house-robber", "dp", "1D DP (Take/Skip)", "House Robber", "Medium", 25, 88, 94, "amazon,google,microsoft", "take or skip,rolling variables,adjacency constraint", "Maximise a total when you cannot pick two adjacent items."],
  ["house-robber-ii", "dp", "1D DP (Circular)", "House Robber II", "Medium", 25, 72, 88, "amazon,google", "circular constraint,two linear runs", "Solve the same problem when the items form a circle."],
  ["decode-ways", "dp", "1D DP (Parsing)", "Decode Ways", "Medium", 30, 78, 88, "meta,amazon,microsoft,uber", "one and two digit branching,zero handling", "Count how many ways a digit string maps back to letters."],
  ["word-break", "dp", "1D DP (Partition)", "Word Break", "Medium", 30, 88, 92, "amazon,google,meta,uber", "prefix feasibility,dictionary lookup,partition DP", "Decide whether a string splits entirely into dictionary words."],
  ["coin-change", "dp", "Unbounded Knapsack", "Coin Change", "Medium", 30, 92, 96, "amazon,google,uber,microsoft", "unbounded knapsack,minimisation,bottom-up", "Make an amount with the fewest coins."],
  ["coin-change-ii", "dp", "Unbounded Knapsack (Count)", "Coin Change II", "Medium", 30, 74, 92, "amazon,google", "combination counting,loop order,knapsack", "Count the distinct ways to make an amount."],
  ["combination-sum-iv", "dp", "Unbounded Knapsack (Permutations)", "Combination Sum IV", "Medium", 25, 60, 86, "amazon,google", "order-sensitive counting,loop order contrast", "Count ordered sequences summing to a target, contrasting with the combination version."],
  ["partition-equal-subset-sum", "dp", "0/1 Knapsack", "Partition Equal Subset Sum", "Medium", 30, 78, 94, "amazon,google,meta", "subset sum,boolean knapsack,bitset trick", "Decide whether a set splits into two halves of equal total."],
  ["target-sum", "dp", "0/1 Knapsack", "Target Sum", "Medium", 30, 68, 88, "meta,amazon,google", "sign assignment,subset-sum reduction,memoisation", "Count sign assignments that make an expression hit a target."],
  ["longest-increasing-subsequence", "dp", "Subsequence DP", "Longest Increasing Subsequence", "Medium", 30, 86, 94, "amazon,microsoft,google,goldman-sachs", "quadratic DP,patience sorting,binary search variant", "Find the longest rising subsequence."],
  ["longest-common-subsequence", "dp", "2D Grid DP", "Longest Common Subsequence", "Medium", 30, 84, 94, "amazon,google,microsoft", "2D table,match and skip,string DP", "Find the longest sequence appearing in order in both strings."],
  ["longest-palindromic-subsequence", "dp", "Interval DP", "Longest Palindromic Subsequence", "Medium", 30, 62, 86, "amazon,adobe", "interval DP,reverse LCS trick", "Find the longest palindromic subsequence of a string."],
  ["edit-distance", "dp", "2D Grid DP", "Edit Distance", "Hard", 40, 82, 94, "amazon,google,microsoft,meta", "insert delete replace,2D table,string alignment", "Compute the fewest single-character edits turning one string into another."],
  ["distinct-subsequences", "dp", "2D Grid DP", "Distinct Subsequences", "Hard", 40, 55, 84, "amazon,google", "counting DP,match branching", "Count how many ways one string appears as a subsequence of another."],
  ["unique-paths", "dp", "Grid DP", "Unique Paths", "Medium", 20, 82, 88, "amazon,google,adobe", "grid recurrence,combinatorics alternative", "Count lattice paths across a grid moving only right and down."],
  ["unique-paths-ii", "dp", "Grid DP with Obstacles", "Unique Paths II", "Medium", 25, 66, 84, "amazon,microsoft", "obstacle handling,in-place rows", "Count grid paths when some cells are blocked."],
  ["minimum-path-sum", "dp", "Grid DP", "Minimum Path Sum", "Medium", 25, 74, 88, "amazon,google,goldman-sachs", "grid recurrence,in-place DP", "Find the cheapest top-left to bottom-right path in a cost grid."],
  ["best-time-to-buy-and-sell-stock-with-cooldown", "dp", "State Machine DP", "Best Time to Buy and Sell Stock with Cooldown", "Medium", 35, 66, 90, "amazon,google,goldman-sachs", "state machine,hold/sold/rest,transitions", "Maximise trading profit when a rest day follows every sale."],
  ["maximal-square", "dp", "2D Grid DP", "Maximal Square", "Medium", 30, 66, 86, "amazon,google,meta", "min of three neighbours,side length DP", "Find the largest all-ones square inside a binary matrix."],
  ["burst-balloons", "dp", "Interval DP", "Burst Balloons", "Hard", 40, 55, 88, "google,amazon", "interval DP,last-to-burst reframing", "Choose a popping order maximising total score, using an interval formulation."],

  // ============================ INTERVALS ============================
  ["merge-intervals", "intervals", "Sort and Merge", "Merge Intervals", "Medium", 25, 94, 96, "amazon,google,meta,microsoft,uber", "sorting by start,overlap merging", "Collapse overlapping ranges into the fewest possible ranges."],
  ["insert-interval", "intervals", "Sweep and Merge", "Insert Interval", "Medium", 30, 80, 90, "google,amazon,linkedin", "three-phase sweep,merge on overlap", "Insert a new range into a sorted, non-overlapping list and merge as needed."],
  ["non-overlapping-intervals", "intervals", "Greedy by End Time", "Non-overlapping Intervals", "Medium", 30, 74, 92, "amazon,google", "sort by end,activity selection,greedy", "Remove the fewest ranges so none overlap."],
  ["meeting-rooms", "intervals", "Sort and Scan", "Meeting Rooms", "Easy", 20, 72, 84, "meta,amazon,google", "sorting,adjacent overlap check", "Decide whether one person can attend every meeting."],
  ["meeting-rooms-ii", "intervals", "Sweep Line / Min Heap", "Meeting Rooms II", "Medium", 30, 90, 96, "amazon,google,meta,uber", "min-heap of end times,sweep line,resource counting", "Find the fewest rooms needed to hold all meetings."],
  ["minimum-number-of-arrows-to-burst-balloons", "intervals", "Greedy by End Time", "Minimum Number of Arrows to Burst Balloons", "Medium", 25, 66, 88, "amazon,google", "sort by end,greedy stabbing points", "Cover every range using the fewest points."],
  ["interval-list-intersections", "intervals", "Two-Pointer Merge", "Interval List Intersections", "Medium", 25, 64, 86, "meta,amazon,google", "two pointers on sorted lists,overlap arithmetic", "Find every overlap between two sorted lists of ranges."],

  // ============================ TRIE ============================
  ["implement-trie-prefix-tree", "trie", "Trie Construction", "Implement Trie (Prefix Tree)", "Medium", 30, 82, 92, "amazon,google,microsoft", "prefix tree,node children,design", "Build a prefix tree supporting insert, exact search, and prefix search."],
  ["design-add-and-search-words-data-structure", "trie", "Trie with Wildcards", "Design Add and Search Words Data Structure", "Medium", 35, 70, 90, "amazon,meta,google", "trie,wildcard DFS,design", "Extend a prefix tree so searches may contain single-character wildcards."],
  ["word-search-ii", "trie", "Trie + Grid Backtracking", "Word Search II", "Hard", 40, 66, 94, "amazon,google,microsoft", "trie pruning,grid DFS,batch matching", "Find all dictionary words traceable through a letter grid at once."],
  ["replace-words", "trie", "Trie Prefix Lookup", "Replace Words", "Medium", 25, 54, 80, "amazon,google", "shortest prefix match,trie walk", "Replace each word with the shortest dictionary root that prefixes it."],
  ["longest-word-in-dictionary", "trie", "Trie Buildability", "Longest Word in Dictionary", "Medium", 25, 52, 78, "google,amazon", "incremental buildability,trie or set,lexicographic tie-break", "Find the longest word that can be built one letter at a time from other words."],

  // ============================ BIT MANIPULATION ============================
  ["single-number", "bit-manipulation", "XOR Cancellation", "Single Number", "Easy", 20, 82, 88, "amazon,google,microsoft", "xor properties,self-cancellation", "Find the one unpaired value when every other appears twice."],
  ["single-number-ii", "bit-manipulation", "Bit Counting", "Single Number II", "Medium", 30, 56, 82, "amazon,google", "bit tallying modulo three,state machine", "Find the one unpaired value when every other appears three times."],
  ["number-of-1-bits", "bit-manipulation", "Bit Counting", "Number of 1 Bits", "Easy", 20, 74, 80, "amazon,microsoft,apple", "popcount,n and n-1 trick", "Count set bits in an integer."],
  ["counting-bits", "bit-manipulation", "Bit DP", "Counting Bits", "Easy", 20, 68, 84, "amazon,google", "DP on bits,shift recurrence", "Count set bits for every number up to n in linear time."],
  ["reverse-bits", "bit-manipulation", "Bit Reversal", "Reverse Bits", "Easy", 20, 62, 72, "amazon,apple,adobe", "bit shifting,masking", "Reverse the bit order of a 32-bit integer."],
  ["missing-number", "bit-manipulation", "XOR / Sum Trick", "Missing Number", "Easy", 20, 76, 82, "amazon,microsoft,google", "xor pairing,gauss sum,constant space", "Find the missing value from a range with one gap."],
  ["sum-of-two-integers", "bit-manipulation", "Adder Simulation", "Sum of Two Integers", "Medium", 30, 54, 78, "amazon,microsoft", "carry via and,sum via xor,shift loop", "Add two integers without using arithmetic operators."],
  ["maximum-xor-of-two-numbers-in-an-array", "bit-manipulation", "Bitwise Trie", "Maximum XOR of Two Numbers in an Array", "Medium", 35, 55, 88, "google,amazon", "binary trie,greedy bit choice", "Find the largest XOR obtainable from any pair in an array."],

  // ============================ MATH ============================
  ["powx-n", "math-dsa", "Fast Exponentiation", "Pow(x, n)", "Medium", 25, 74, 86, "amazon,meta,google,linkedin", "binary exponentiation,recursion,negative powers", "Compute a power in logarithmic time."],
  ["happy-number", "math-dsa", "Cycle Detection", "Happy Number", "Easy", 20, 62, 78, "amazon,google,uber", "digit squares,floyd cycle,set alternative", "Decide whether repeatedly summing squared digits reaches one."],
  ["count-primes", "math-dsa", "Sieve of Eratosthenes", "Count Primes", "Medium", 25, 64, 82, "amazon,microsoft,adobe", "sieve,composite marking,complexity", "Count primes below a limit efficiently."],
  ["reverse-integer", "math-dsa", "Digit Manipulation", "Reverse Integer", "Medium", 20, 66, 62, "amazon,adobe,microsoft", "digit extraction,overflow check", "Reverse the digits of an integer, returning zero on overflow."],
  ["random-pick-with-weight", "math-dsa", "Prefix Sum + Binary Search", "Random Pick with Weight", "Medium", 30, 72, 92, "meta,amazon,google", "cumulative weights,binary search,sampling", "Sample an index in proportion to its weight."],
];

const LC = (slug: string) => `https://leetcode.com/problems/${slug}/`;

export const DSA_QUESTIONS: SeedQuestion[] = ROWS.map((r, i) => {
  const [slug, topic, pattern, title, difficulty, minutes, frequency, patternValue, companies, concepts, prompt] = r;
  return {
    id: `dsa-${String(i + 1).padStart(3, "0")}`,
    category: "DSA",
    topic,
    pattern,
    title,
    difficulty,
    estimatedMinutes: minutes,
    source: "LeetCode",
    sourceUrl: LC(slug),
    sourceNote: "Pattern drill cross-referenced against the NeetCode roadmap and Striver A2Z sheet.",
    companyTags: companies ? companies.split(",") : [],
    frequencyScore: frequency,
    patternValue,
    conceptCoverage: Math.round((frequency + patternValue) / 2),
    concepts: concepts.split(","),
    prompt,
  };
});
