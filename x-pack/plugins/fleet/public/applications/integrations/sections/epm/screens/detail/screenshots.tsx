/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
import React, { useState, useMemo, memo } from 'react';
import { i18n } from '@kbn/i18n';
import { FormattedMessage } from '@kbn/i18n/react';
import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiImage,
  EuiText,
  EuiTextColor,
  EuiButtonIcon,
} from '@elastic/eui';
import { ScreenshotItem } from '../../../../../../types';
import { useLinks } from '../../hooks';

interface ScreenshotProps {
  images: ScreenshotItem[];
  packageName: string;
  version: string;
}

export const Screenshots: React.FC<ScreenshotProps> = memo(({ images, packageName, version }) => {
  const { toPackageImage } = useLinks();
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const maxImageIndex = useMemo(() => images.length - 1, [images.length]);
  const currentImageUrl = useMemo(
    () => toPackageImage(images[currentImageIndex], packageName, version),
    [currentImageIndex, images, packageName, toPackageImage, version]
  );

  return (
    <EuiFlexGroup direction="column" gutterSize="s">
      {/* Title with carousel navigation */}
      <EuiFlexItem>
        <EuiFlexGroup direction="row" alignItems="center">
          <EuiFlexItem>
            <EuiText>
              <h4>
                <FormattedMessage
                  id="xpack.fleet.epm.screenshotsTitle"
                  defaultMessage="Screenshots"
                />
              </h4>
            </EuiText>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiFlexGroup gutterSize="xs" alignItems="center">
              <EuiFlexItem grow={false}>
                <EuiButtonIcon
                  iconType="arrowLeft"
                  color="text"
                  isDisabled={currentImageIndex === 0}
                  onClick={() => setCurrentImageIndex(Math.max(currentImageIndex - 1, 0))}
                />
              </EuiFlexItem>
              <EuiFlexItem>
                <EuiText className="eui-textNoWrap" size="s">
                  <FormattedMessage
                    id="xpack.fleet.epm.screenshotsNavigationLinkText"
                    defaultMessage="{currentImage} of {totalImages}"
                    values={{
                      currentImage: (
                        <EuiTextColor color="secondary">
                          <strong>
                            <u>{currentImageIndex + 1}</u>
                          </strong>
                        </EuiTextColor>
                      ),
                      totalImages: maxImageIndex + 1,
                    }}
                  />
                </EuiText>
              </EuiFlexItem>
              <EuiFlexItem grow={false}>
                <EuiButtonIcon
                  iconType="arrowRight"
                  color="text"
                  isDisabled={currentImageIndex === maxImageIndex}
                  onClick={() =>
                    setCurrentImageIndex(Math.min(currentImageIndex + 1, maxImageIndex))
                  }
                />
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiFlexItem>

      {/* Current screenshot */}
      <EuiFlexItem>
        {currentImageUrl ? (
          <EuiImage
            allowFullScreen
            hasShadow
            alt={
              images[currentImageIndex].title ||
              i18n.translate('xpack.fleet.epm.screenshotAltText', {
                defaultMessage: '{packageName} screenshot #{imageNumber}',
                values: {
                  packageName,
                  imageNumber: currentImageIndex + 1,
                },
              })
            }
            url={currentImageUrl}
          />
        ) : (
          <FormattedMessage
            id="xpack.fleet.epm.screenshotErrorText"
            defaultMessage="Unable to load this screenshot"
          />
        )}
      </EuiFlexItem>
    </EuiFlexGroup>
  );
});
