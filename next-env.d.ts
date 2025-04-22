/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.
interface PageProps {
    searchParams: Record<string, string | string[] | undefined>;
    params?: Record<string, string>;
  }