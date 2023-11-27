"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticMask = exports.PassiveMask = exports.LayoutMask = exports.MutationMask = exports.BeforeMutationMask = exports.MountPassiveDev = exports.MountLayoutDev = exports.PlacementDEV = exports.MaySuspendCommit = exports.PassiveStatic = exports.LayoutStatic = exports.RefStatic = exports.Forked = exports.NeedsPropagation = exports.DidPropagateContext = exports.ForceUpdateForLegacySuspense = exports.ShouldCapture = exports.Incomplete = exports.HostEffectMask = exports.LifecycleEffectMask = exports.ShouldSuspendCommit = exports.ScheduleRetry = exports.StoreConsistency = exports.Visibility = exports.Passive = exports.Snapshot = exports.Ref = exports.ForceClientRender = exports.Callback = exports.ContentReset = exports.ChildDeletion = exports.Update = exports.Hydrating = exports.DidCapture = exports.Placement = exports.PerformedWork = exports.NoFlags = void 0;
var react_feature_flags_1 = require("@zenflux/react-shared/src/react-feature-flags");
// Don't change these values. They're used by React Dev Tools.
exports.NoFlags = 
/*                      */
0;
exports.PerformedWork = 
/*                */
1;
exports.Placement = 
/*                    */
2;
exports.DidCapture = 
/*                   */
128;
exports.Hydrating = 
/*                    */
4096;
// You can change the rest (and add more).
exports.Update = 
/*                       */
4;
/* Skipped value:                                 0b0000000000000000000000001000; */
exports.ChildDeletion = 
/*                */
16;
exports.ContentReset = 
/*                 */
32;
exports.Callback = 
/*                     */
64;
/* Used by DidCapture:                            0b0000000000000000000010000000; */
exports.ForceClientRender = 
/*            */
256;
exports.Ref = 
/*                          */
512;
exports.Snapshot = 
/*                     */
1024;
exports.Passive = 
/*                      */
2048;
/* Used by Hydrating:                             0b0000000000000001000000000000; */
exports.Visibility = 
/*                   */
8192;
exports.StoreConsistency = 
/*             */
16384;
// It's OK to reuse these bits because these flags are mutually exclusive for
// different fiber types. We should really be doing this for as many flags as
// possible, because we're about to run out of bits.
exports.ScheduleRetry = exports.StoreConsistency;
exports.ShouldSuspendCommit = exports.Visibility;
exports.LifecycleEffectMask = exports.Passive | exports.Update | exports.Callback | exports.Ref | exports.Snapshot | exports.StoreConsistency;
// Union of all commit flags (flags with the lifetime of a particular commit)
exports.HostEffectMask = 
/*               */
32767;
// These are not really side effects, but we still reuse this field.
exports.Incomplete = 
/*                   */
32768;
exports.ShouldCapture = 
/*                */
65536;
exports.ForceUpdateForLegacySuspense = 
/* */
131072;
exports.DidPropagateContext = 
/*          */
262144;
exports.NeedsPropagation = 
/*             */
524288;
exports.Forked = 
/*                       */
1048576;
// Static tags describe aspects of a fiber that are not specific to a render,
// e.g. a fiber uses a passive effect (even if there are no updates on this particular render).
// This enables us to defer more work in the unmount case,
// since we can defer traversing the tree during layout to look for Passive effects,
// and instead rely on the static flag as a signal that there may be cleanup work.
exports.RefStatic = 
/*                    */
2097152;
exports.LayoutStatic = 
/*                 */
4194304;
exports.PassiveStatic = 
/*                */
8388608;
exports.MaySuspendCommit = 
/*             */
16777216;
// Flag used to identify newly inserted fibers. It isn't reset after commit unlike `Placement`.
exports.PlacementDEV = 
/*                 */
33554432;
exports.MountLayoutDev = 
/*               */
67108864;
exports.MountPassiveDev = 
/*              */
134217728;
// Groups of flags that are used in the commit phase to skip over trees that
// don't contain effects, by checking subtreeFlags.
exports.BeforeMutationMask = 
// flag logic (see #20043)
exports.Update | exports.Snapshot | (react_feature_flags_1.enableCreateEventHandleAPI ? // createEventHandle needs to visit deleted and hidden trees to
    // fire beforeblur
    // TODO: Only need to visit Deletions during BeforeMutation phase if an
    // element is focused.
    exports.ChildDeletion | exports.Visibility : 0);
exports.MutationMask = exports.Placement | exports.Update | exports.ChildDeletion | exports.ContentReset | exports.Ref | exports.Hydrating | exports.Visibility;
exports.LayoutMask = exports.Update | exports.Callback | exports.Ref | exports.Visibility;
// TODO: Split into PassiveMountMask and PassiveUnmountMask
exports.PassiveMask = exports.Passive | exports.Visibility | exports.ChildDeletion;
// Union of tags that don't get reset on clones.
// This allows certain concepts to persist without recalculating them,
// e.g. whether a subtree contains passive effects or portals.
exports.StaticMask = exports.LayoutStatic | exports.PassiveStatic | exports.RefStatic | exports.MaySuspendCommit;
