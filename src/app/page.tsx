'use client';
import { PageLayoutTypes } from 'anitha/requirements/data-models';
import { PageLayout } from '../requirements/feature/frameworks/page-layout';

export default function Home() {
  return (
    <PageLayout pageType={PageLayoutTypes.WEEK} day={5} title="Your Todo's" />
  );
}
