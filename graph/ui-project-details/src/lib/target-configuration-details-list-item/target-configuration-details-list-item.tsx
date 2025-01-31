/* eslint-disable @nx/enforce-module-boundaries */
// nx-ignore-next-line
import type { ProjectGraphProjectNode } from '@nx/devkit';
import { forwardRef, Ref } from 'react';
import TargetConfigurationDetails from '../target-configuration-details/target-configuration-details';

export interface TargetConfigurationDetailsListItemProps {
  project: ProjectGraphProjectNode;
  sourceMap: Record<string, string[]>;
  variant?: 'default' | 'compact';
  onRunTarget?: (data: { projectName: string; targetName: string }) => void;
  onViewInTaskGraph?: (data: {
    projectName: string;
    targetName: string;
  }) => void;
  targetName: string;
  collapsable: boolean;
}

export const TargetConfigurationDetailsListItem = forwardRef(
  (
    {
      project,
      variant,
      sourceMap,
      onRunTarget,
      onViewInTaskGraph,
      targetName,
      collapsable,
    }: TargetConfigurationDetailsListItemProps,
    ref: Ref<HTMLLIElement>
  ) => {
    const target = project.data.targets?.[targetName];
    if (!target) {
      return null;
    }
    return (
      <li className="mb-4 last:mb-0" key={`target-${targetName}`} ref={ref}>
        <TargetConfigurationDetails
          variant={variant}
          projectName={project.name}
          targetName={targetName}
          targetConfiguration={target}
          sourceMap={sourceMap}
          onRunTarget={onRunTarget}
          onViewInTaskGraph={onViewInTaskGraph}
          collapsable={collapsable}
        />
      </li>
    );
  }
);
