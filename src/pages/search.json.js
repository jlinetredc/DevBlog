import { getCollection } from 'astro:content';

export async function GET() {
    const blog = await getCollection('blog');
    const searchData = blog.map((post) => ({
        title: post.data.title,
        description: post.data.description,
        slug: `/blog/${post.slug}`,
        category: post.data.category,
    }));

    return new Response(JSON.stringify(searchData), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
