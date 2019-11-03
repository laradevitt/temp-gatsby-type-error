const fetch = require('node-fetch');
const path = require('path');

exports.sourceNodes = async ({ actions, createNodeId, createContentDigest }) => {

  // Get city neighbourhoods.
  try {
    // The endpoint for the dataset.
    const endpoint = 'https://data.edmonton.ca/resource/65fr-66s6.json';

    const result = await fetch(endpoint);
    const data = await result.json();

    data.forEach((item) => {
      const node = {
        ...item,
        id: createNodeId(`n-${item.neighbourhood_number}`),
        internal: {
          type: 'Neighbourhood',
          contentDigest: createContentDigest(item),
        },
      };
      actions.createNode(node);
    });
  } catch (error) {
    console.log(error);
  }
};

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions;

  return graphql(`
      {
        allNeighbourhood {
          edges {
            node {
              name
              neighbourhood_number
            }
          }
        }
      }
    `).then((result) => {
    if (result.errors) {
      return Promise.reject(result.errors);
    }

    const pages = result.data.allNeighbourhood.edges;

    pages.forEach(({ node }) => {
      createPage({
        path: node.neighbourhood_number,
        component: path.resolve('src/templates/place.js'),
        context: {
          nid: node.neighbourhood_number,
          name: node.name,
        },
      });
    });
    return true;
  });
};
