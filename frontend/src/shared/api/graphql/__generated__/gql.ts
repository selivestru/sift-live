/* eslint-disable */
import * as types from './graphql.js';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      accessToken\n      user {\n        id\n        email\n        username\n        color\n      }\n    }\n  }\n": typeof types.LoginDocument,
    "\n  mutation Register($input: RegisterInput!) {\n    register(input: $input) {\n      accessToken\n      user {\n        id\n        email\n        username\n        color\n      }\n    }\n  }\n": typeof types.RegisterDocument,
    "\n  mutation UpdateUserColor($input: UpdateUserColorInput!) {\n    updateUserColor(input: $input) {\n      id\n      email\n      username\n      color\n    }\n  }\n": typeof types.UpdateUserColorDocument,
    "\n  query FollowedChannels {\n    followedChannels {\n      id\n      username\n      title\n      category {\n        id\n        title\n        slug\n        image\n      }\n      tags\n      isLive\n      userId\n      isFollowing\n    }\n  }\n": typeof types.FollowedChannelsDocument,
    "\n  query LiveChannels {\n    liveChannels {\n      id\n      username\n      title\n      category {\n        id\n        title\n        slug\n        image\n      }\n      tags\n      isLive\n      userId\n      isFollowing\n    }\n  }\n": typeof types.LiveChannelsDocument,
    "\n  query Channel($username: String!) {\n    channel(username: $username) {\n      id\n      username\n      title\n      category {\n        id\n        title\n        slug\n        image\n      }\n      tags\n      isLive\n      userId\n      isFollowing\n    }\n  }\n": typeof types.ChannelDocument,
    "\n  mutation FollowChannel($channelId: String!) {\n    followChannel(channelId: $channelId) {\n      id\n      username\n      title\n      category {\n        id\n        title\n        slug\n        image\n      }\n      tags\n      isLive\n      userId\n      isFollowing\n    }\n  }\n": typeof types.FollowChannelDocument,
    "\n  mutation UnFollowChannel($channelId: String!) {\n    unFollowChannel(channelId: $channelId) {\n      id\n      username\n      title\n      category {\n        id\n        title\n        slug\n        image\n      }\n      tags\n      isLive\n      userId\n      isFollowing\n    }\n  }\n": typeof types.UnFollowChannelDocument,
    "\n  mutation Logout {\n    logout\n  }\n": typeof types.LogoutDocument,
    "\n  query Me {\n    me {\n      id\n      email\n      username\n      color\n    }\n  }\n": typeof types.MeDocument,
    "\n  mutation Refresh {\n    refresh {\n      accessToken\n    }\n  }\n": typeof types.RefreshDocument,
};
const documents: Documents = {
    "\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      accessToken\n      user {\n        id\n        email\n        username\n        color\n      }\n    }\n  }\n": types.LoginDocument,
    "\n  mutation Register($input: RegisterInput!) {\n    register(input: $input) {\n      accessToken\n      user {\n        id\n        email\n        username\n        color\n      }\n    }\n  }\n": types.RegisterDocument,
    "\n  mutation UpdateUserColor($input: UpdateUserColorInput!) {\n    updateUserColor(input: $input) {\n      id\n      email\n      username\n      color\n    }\n  }\n": types.UpdateUserColorDocument,
    "\n  query FollowedChannels {\n    followedChannels {\n      id\n      username\n      title\n      category {\n        id\n        title\n        slug\n        image\n      }\n      tags\n      isLive\n      userId\n      isFollowing\n    }\n  }\n": types.FollowedChannelsDocument,
    "\n  query LiveChannels {\n    liveChannels {\n      id\n      username\n      title\n      category {\n        id\n        title\n        slug\n        image\n      }\n      tags\n      isLive\n      userId\n      isFollowing\n    }\n  }\n": types.LiveChannelsDocument,
    "\n  query Channel($username: String!) {\n    channel(username: $username) {\n      id\n      username\n      title\n      category {\n        id\n        title\n        slug\n        image\n      }\n      tags\n      isLive\n      userId\n      isFollowing\n    }\n  }\n": types.ChannelDocument,
    "\n  mutation FollowChannel($channelId: String!) {\n    followChannel(channelId: $channelId) {\n      id\n      username\n      title\n      category {\n        id\n        title\n        slug\n        image\n      }\n      tags\n      isLive\n      userId\n      isFollowing\n    }\n  }\n": types.FollowChannelDocument,
    "\n  mutation UnFollowChannel($channelId: String!) {\n    unFollowChannel(channelId: $channelId) {\n      id\n      username\n      title\n      category {\n        id\n        title\n        slug\n        image\n      }\n      tags\n      isLive\n      userId\n      isFollowing\n    }\n  }\n": types.UnFollowChannelDocument,
    "\n  mutation Logout {\n    logout\n  }\n": types.LogoutDocument,
    "\n  query Me {\n    me {\n      id\n      email\n      username\n      color\n    }\n  }\n": types.MeDocument,
    "\n  mutation Refresh {\n    refresh {\n      accessToken\n    }\n  }\n": types.RefreshDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      accessToken\n      user {\n        id\n        email\n        username\n        color\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      accessToken\n      user {\n        id\n        email\n        username\n        color\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Register($input: RegisterInput!) {\n    register(input: $input) {\n      accessToken\n      user {\n        id\n        email\n        username\n        color\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation Register($input: RegisterInput!) {\n    register(input: $input) {\n      accessToken\n      user {\n        id\n        email\n        username\n        color\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateUserColor($input: UpdateUserColorInput!) {\n    updateUserColor(input: $input) {\n      id\n      email\n      username\n      color\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateUserColor($input: UpdateUserColorInput!) {\n    updateUserColor(input: $input) {\n      id\n      email\n      username\n      color\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query FollowedChannels {\n    followedChannels {\n      id\n      username\n      title\n      category {\n        id\n        title\n        slug\n        image\n      }\n      tags\n      isLive\n      userId\n      isFollowing\n    }\n  }\n"): (typeof documents)["\n  query FollowedChannels {\n    followedChannels {\n      id\n      username\n      title\n      category {\n        id\n        title\n        slug\n        image\n      }\n      tags\n      isLive\n      userId\n      isFollowing\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query LiveChannels {\n    liveChannels {\n      id\n      username\n      title\n      category {\n        id\n        title\n        slug\n        image\n      }\n      tags\n      isLive\n      userId\n      isFollowing\n    }\n  }\n"): (typeof documents)["\n  query LiveChannels {\n    liveChannels {\n      id\n      username\n      title\n      category {\n        id\n        title\n        slug\n        image\n      }\n      tags\n      isLive\n      userId\n      isFollowing\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Channel($username: String!) {\n    channel(username: $username) {\n      id\n      username\n      title\n      category {\n        id\n        title\n        slug\n        image\n      }\n      tags\n      isLive\n      userId\n      isFollowing\n    }\n  }\n"): (typeof documents)["\n  query Channel($username: String!) {\n    channel(username: $username) {\n      id\n      username\n      title\n      category {\n        id\n        title\n        slug\n        image\n      }\n      tags\n      isLive\n      userId\n      isFollowing\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation FollowChannel($channelId: String!) {\n    followChannel(channelId: $channelId) {\n      id\n      username\n      title\n      category {\n        id\n        title\n        slug\n        image\n      }\n      tags\n      isLive\n      userId\n      isFollowing\n    }\n  }\n"): (typeof documents)["\n  mutation FollowChannel($channelId: String!) {\n    followChannel(channelId: $channelId) {\n      id\n      username\n      title\n      category {\n        id\n        title\n        slug\n        image\n      }\n      tags\n      isLive\n      userId\n      isFollowing\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UnFollowChannel($channelId: String!) {\n    unFollowChannel(channelId: $channelId) {\n      id\n      username\n      title\n      category {\n        id\n        title\n        slug\n        image\n      }\n      tags\n      isLive\n      userId\n      isFollowing\n    }\n  }\n"): (typeof documents)["\n  mutation UnFollowChannel($channelId: String!) {\n    unFollowChannel(channelId: $channelId) {\n      id\n      username\n      title\n      category {\n        id\n        title\n        slug\n        image\n      }\n      tags\n      isLive\n      userId\n      isFollowing\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Logout {\n    logout\n  }\n"): (typeof documents)["\n  mutation Logout {\n    logout\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Me {\n    me {\n      id\n      email\n      username\n      color\n    }\n  }\n"): (typeof documents)["\n  query Me {\n    me {\n      id\n      email\n      username\n      color\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Refresh {\n    refresh {\n      accessToken\n    }\n  }\n"): (typeof documents)["\n  mutation Refresh {\n    refresh {\n      accessToken\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;