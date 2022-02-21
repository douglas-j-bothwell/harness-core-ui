/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import { BUILD_TYPE, getCIModuleProperties } from '../PipelineExecutionFilterRequestUtils'

describe('Test util methods', () => {
  test('Test getCIModuleProperties method', () => {
    const moduleProperties = getCIModuleProperties(BUILD_TYPE.PULL_OR_MERGE_REQUEST, {
      buildType: BUILD_TYPE.PULL_OR_MERGE_REQUEST,
      repositoryName: 'harness-core-ui',
      sourceBranch: 'feature-branch',
      targetBranch: 'develop'
    })
    expect(Object.prototype.hasOwnProperty.call(moduleProperties, 'ciExecutionInfoDTO')).toBeTruthy()
    expect(Object.prototype.hasOwnProperty.call(moduleProperties, 'repoName')).toBeTruthy()
  })
})
