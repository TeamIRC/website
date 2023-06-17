/*
import { Octokit } from '@octokit/rest'
import { globby } from 'globby'

const access_token = ""
const octo = new Octokit({
    auth: access_token,
})
// For this, I was working on a organization repos, but it works for common repos also (replace org for owner)
const org = `my-organization`
const repo = `my-repo`

export const uploadToRepo = async (
    coursePath: string,
    branch: string = `master`
) => {
    // gets commit's AND its tree's SHA
    const currentCommit = await getCurrentCommit(branch)
    const filesPaths = await globby(coursePath)
    const filesBlobs = await Promise.all(filesPaths.map(createBlobForFile()))
    const pathsForBlobs = filesPaths.map(fullPath => path.relative(coursePath, fullPath))
    const newTree = await createNewTree(
        filesBlobs,
        pathsForBlobs,
        currentCommit.treeSha
    )
    const commitMessage = `My commit message`
    const newCommit = await createNewCommit(
        commitMessage,
        newTree.sha,
        currentCommit.commitSha
    )
    await setBranchToCommit(branch, newCommit.sha)
}


const getCurrentCommit = async (
    branch: string = 'master'
) => {
    const { data: refData } = await octo.git.getRef({
        owner: org,
        repo,
        ref: `heads/${branch}`,
    })
    const commitSha = refData.object.sha
    const { data: commitData } = await octo.git.getCommit({
        owner: org,
        repo,
        commit_sha: commitSha,
    })
    return {
        commitSha,
        treeSha: commitData.tree.sha,
    }
}

// Notice that readFile's utf8 is typed differently from Github's utf-8
const getFileAsUTF8 = (filePath: string) => readFile(filePath, 'utf8')

const createBlobForFile = () => async (
    filePath: string
) => {
    const content = await getFileAsUTF8(filePath)
    const blobData = await octo.git.createBlob({
        owner: org,
        repo,
        content,
        encoding: 'utf-8',
    })
    return blobData.data
}

const createNewTree = async (
    blobs: Octokit.GitCreateBlobResponse[],
    paths: string[],
    parentTreeSha: string
) => {
    // My custom config. Could be taken as parameters
    const tree = blobs.map(({ sha }, index) => ({
        path: paths[index],
        mode: `100644`,
        type: `blob`,
        sha,
    })) as Octokit.GitCreateTreeParamsTree[]
    const { data } = await octo.git.createTree({
        owner: org,
        repo,
        tree,
        base_tree: parentTreeSha,
    })
    return data
}

const createNewCommit = async (
    message: string,
    currentTreeSha: string,
    currentCommitSha: string
) =>
    (await octo.git.createCommit({
        owner: org,
        repo,
        message,
        tree: currentTreeSha,
        parents: [currentCommitSha],
    })).data

const setBranchToCommit = (
    branch: string = `master`,
    commitSha: string
) =>
    octo.git.updateRef({
        owner: org,
        repo,
        ref: `heads/${branch}`,
        sha: commitSha,
    })
*/