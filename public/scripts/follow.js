/* eslint-disable @typescript-eslint/restrict-template-expressions */

function getFollowRelationship(fields) {
  fetch(`/api/follow?followee=${fields.followee}&follower=${fields.follower}`)
    .then(showResponse)
    .catch(showResponse);
}

function makeFollow(fields) {
  fetch(`/api/follow`, {
    method: "POST",
    body: JSON.stringify(fields),
    headers: { "Content-Type": "application/json" },
  })
    .then(showResponse)
    .catch(showResponse);
}

function deleteFollow(fields) {
  fetch(`/api/follow`, {
    method: "DELETE",
    body: JSON.stringify(fields),
    headers: { "Content-Type": "application/json" },
  })
    .then(showResponse)
    .then(showResponse);
}

function getFollowing(fields) {
  fetch(`/api/follow/following/${fields.userId}`)
    .then(showResponse)
    .catch(showResponse);
}

function getFollowers(fields) {
  fetch(`/api/follow/followers/${fields.userId}`)
    .then(showResponse)
    .catch(showResponse);
}
