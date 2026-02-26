import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import Layout from './components/Layout';
import Gallery from './pages/Gallery';
import ArtworkDetail from './pages/ArtworkDetail';
import Upload from './pages/Upload';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import BlogCreate from './pages/BlogCreate';
import NFTGallery from './pages/NFTGallery';
import NFTDetail from './pages/NFTDetail';
import AdminDashboard from './pages/AdminDashboard';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Layout>
        <Outlet />
      </Layout>
      <Toaster />
    </>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Gallery,
});

const artworkRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/artwork/$id',
  component: ArtworkDetail,
});

const uploadRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/upload',
  component: Upload,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/kontakt',
  component: Contact,
});

const blogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/blog',
  component: Blog,
});

const blogPostRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/blog/$id',
  component: BlogPost,
});

const blogCreateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/blog/neu',
  component: BlogCreate,
});

const nftGalleryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/nft-galerie',
  component: NFTGallery,
});

const nftDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/nft/$id',
  component: NFTDetail,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminDashboard,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  artworkRoute,
  uploadRoute,
  contactRoute,
  blogRoute,
  blogPostRoute,
  blogCreateRoute,
  nftGalleryRoute,
  nftDetailRoute,
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
