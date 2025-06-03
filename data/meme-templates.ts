export interface MemeTemplate {
    id: number
    url: string
    name: string
    category: string
  }
  
  // Centralized template data for easy management
  export const memeTemplates: MemeTemplate[] = [
    { id: 1, url: "/templates/drake.jpg", name: "Drake", category: "Popular" },
    { id: 2, url: "/templates/distracted-boyfriend.jpg", name: "Distracted Boyfriend", category: "Classic" },
    { id: 3, url: "/templates/success-kid.jpg", name: "Success Kid", category: "Victory" },
    { id: 4, url: "/templates/change-my-mind.jpg", name: "Change My Mind", category: "Debate" },
    { id: 5, url: "/templates/two-buttons.jpg", name: "Two Buttons", category: "Choice" },
    { id: 6, url: "/templates/expanding-brain.jpg", name: "Expanding Brain", category: "Smart" },
    { id: 7, url: "/templates/woman-yelling.jpg", name: "Woman Yelling at Cat", category: "Reaction" },
    { id: 8, url: "/templates/thinking-guy.jpg", name: "Thinking Guy", category: "Thoughtful" },
    // You can easily add more templates here
  ]  