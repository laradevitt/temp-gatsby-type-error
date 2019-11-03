import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/layout';

const Place = ({ data }) => {
  const { neighbourhood } = data;
  return (
    <Layout>
      <p>{neighbourhood.name} ({neighbourhood.neighbourhood_number})</p>
    </Layout>
  );
};

export default Place;

export const query = graphql`
  query($nid: String!) {
    neighbourhood(neighbourhood_number: {eq: $nid}) {
      name
      neighbourhood_number
    }
  }
`;
