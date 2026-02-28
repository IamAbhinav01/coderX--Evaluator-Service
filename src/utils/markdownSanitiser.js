const marked = require('marked');
const sanitizeHtml = require('sanitize-html');
const TurndownService = require('turndown');
function markdownToHtml(markdown) {
  const turndownService = new TurndownService();

  const convertedMardown = marked.parse(markdown);
  // console.log('converted HTML', convertedMardown);

  const sanitizedHtml = sanitizeHtml(convertedMardown, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      'img',
      'h1',
      'h2',
      'h3',
      'pre',
      'code',
    ]),
    allowedAttributes: {
      code: ['class'],

      pre: ['class'],

      img: ['src', 'alt'],
    },
  });
  // console.log('Sanitised HTML', sanitizedHtml);

  const sanitizedMarkdown = turndownService.turndown(sanitizedHtml);
  // console.log('Turned Markdown', sanitizedMarkdown);

  return sanitizedMarkdown;
}

module.exports = markdownToHtml;
// const input = `

// # Two Sum

// **Difficulty:** Easy

// ---

// ## Problem Statement

// Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

// You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

// You can return the answer in **any order**.

// ---

// ## Example 1:

// **Input:**

// nums = [2,7,11,15], target = 9

// **Output:**

// [0,1]

// **Explanation:**

// Because nums[0] + nums[1] == 9, return [0,1].

// ---

// ## Example 2:

// **Input:**

// nums = [3,2,4], target = 6

// **Output:**

// [1,2]

// ---

// ## Constraints:

// - 2 ≤ nums.length ≤ 10⁴
// - -10⁹ ≤ nums[i] ≤ 10⁹
// - -10⁹ ≤ target ≤ 10⁹
// - Only one valid answer exists.

// ---

// ## Function Signature

// \`\`\`cpp
// vector<int> twoSum(vector<int>& nums, int target);
// \`\`\`

// `;
// markdownToHtml(input);
