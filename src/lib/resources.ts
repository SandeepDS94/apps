export interface Resource {
    title: string;
    url: string;
    type: 'video' | 'article' | 'course';
}

export const topicResources: Record<string, Resource[]> = {
    'javascript': [
        { title: 'MDN Web Docs - JavaScript', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript', type: 'article' },
        { title: 'JavaScript Crash Course', url: 'https://www.youtube.com/watch?v=hdI2bqOjy3c', type: 'video' },
        { title: 'JavaScript.info', url: 'https://javascript.info/', type: 'article' }
    ],
    'python': [
        { title: 'Python Official Docs', url: 'https://docs.python.org/3/', type: 'article' },
        { title: 'Programming with Mosh - Python', url: 'https://www.youtube.com/watch?v=_uQrJ0TkZlc', type: 'video' },
        { title: 'Real Python', url: 'https://realpython.com/', type: 'article' }
    ],
    'react': [
        { title: 'React Documentation', url: 'https://react.dev/', type: 'article' },
        { title: 'React Tutorial for Beginners', url: 'https://www.youtube.com/watch?v=SqcY0GlETPk', type: 'video' }
    ],
    'sql': [
        { title: 'W3Schools SQL Tutorial', url: 'https://www.w3schools.com/sql/', type: 'article' },
        { title: 'SQL Zoo', url: 'https://sqlzoo.net/', type: 'course' }
    ],
    'default': [
        { title: 'Khan Academy', url: 'https://www.khanacademy.org/', type: 'course' },
        { title: 'Coursera', url: 'https://www.coursera.org/', type: 'course' },
        { title: 'YouTube Education', url: 'https://www.youtube.com/education', type: 'video' }
    ]
};

export function getResourcesForTopic(topic: string): Resource[] {
    const normalizedTopic = topic.toLowerCase().trim();
    // Simple partial match
    const key = Object.keys(topicResources).find(k => normalizedTopic.includes(k));
    return key ? topicResources[key] : topicResources['default'];
}
